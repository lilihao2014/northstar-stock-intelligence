import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import {
  createRefreshJob,
  finishRefreshJob,
  isDatabaseConfigured,
  isProductionRuntime,
  listRefreshJobs,
  loadDashboardSnapshot,
  loadFilingSummary,
  loadUserPreference,
  loadUserWatchlistItems,
  loadWatchlistItems,
  saveDashboardSnapshot,
  saveFilingSummary,
  saveUserPreference,
  saveUserWatchlistItems,
  saveWatchlistItem,
  saveWatchlistItems,
  seedDatabaseFromFiles,
  upsertUser,
} from "./db.mjs";
import {
  generateQuarterlySummary,
  reportSummaryPromptVersion,
  resolveQuarterlyFiling,
} from "./report-summary.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const secIdentity = process.env.SEC_USER_AGENT;
const xBearerToken = process.env.X_BEARER_TOKEN;
const authSecret = process.env.AUTH_SECRET || process.env.DATABASE_URL || "northstar-dev-session-secret";
const inviteCode = process.env.NORTHSTAR_INVITE_CODE || "";
const supabaseUrl = (process.env.SUPABASE_URL || "").replace(/\/+$/, "");
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
const openaiApiKey = process.env.OPENAI_API_KEY || "";
const openaiSummaryModel = process.env.OPENAI_SUMMARY_MODEL || "gpt-5-mini";
const dashboardMaxAgeHours = Number(process.env.DASHBOARD_MAX_AGE_HOURS || 18);
const quoteMaxAgeDays = Number(process.env.QUOTE_MAX_AGE_DAYS || 5);
const tickerCachePath = join(root, "data", "sec-tickers.json");
const watchlistPath = join(root, "config", "watchlist.json");
const dashboardPath = join(root, "data", "dashboard.json");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

let tickerDirectory = null;
let refreshQueue = Promise.resolve();
let backgroundRefreshStarted = false;
let lastBackgroundRefreshAt = 0;
const fetchAttempts = new Map();
const summaryAttempts = new Map();
const summaryMemoryCache = new Map();
const summaryTasks = new Map();
const tickerContentCache = new Map();
const allowedStaticFiles = new Set([
  "index.html",
  "styles.css",
  "app.js",
  "data/dashboard.json",
]);

function json(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function readRequestBody(request) {
  return new Promise((resolveBody, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error("Request body is too large"));
        request.destroy();
      }
    });
    request.on("end", () => resolveBody(body));
    request.on("error", reject);
  });
}

async function readJsonBody(request) {
  const body = await readRequestBody(request);
  if (!body.trim()) return {};
  return JSON.parse(body);
}

function parseCookies(header = "") {
  return Object.fromEntries(String(header)
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf("=");
      if (index === -1) return [part, ""];
      return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
    }));
}

function signPayload(payload) {
  return createHmac("sha256", authSecret).update(payload).digest("base64url");
}

function sessionCookieValue(session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${signPayload(payload)}`;
}

function verifySessionCookie(value) {
  if (!value || !value.includes(".")) return null;
  const [payload, signature] = value.split(".");
  const expected = signPayload(payload);
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;
  const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (!session?.email || !session?.userKey || Date.now() > Number(session.expiresAt || 0)) return null;
  return session;
}

function sessionFromRequest(request) {
  try {
    return verifySessionCookie(parseCookies(request.headers.cookie).northstar_session);
  } catch {
    return null;
  }
}

function sessionHeaders(session = null) {
  const secure = isProductionRuntime() ? "; Secure" : "";
  if (!session) {
    return {
      "Set-Cookie": `northstar_session=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`,
    };
  }
  const maxAgeSeconds = Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
  return {
    "Set-Cookie": `northstar_session=${encodeURIComponent(sessionCookieValue(session))}; Max-Age=${maxAgeSeconds}; Path=/; HttpOnly; SameSite=Lax${secure}`,
  };
}

function jsonWithHeaders(response, status, payload, headers = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers,
  });
  response.end(JSON.stringify(payload));
}

function userKeyForEmail(email) {
  return createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}

function publicSession(session) {
  if (!session) return null;
  return {
    email: session.email,
    userKey: session.userKey,
    signedIn: true,
    provider: session.provider || "email",
    name: session.name || null,
    avatarUrl: session.avatarUrl || null,
  };
}

function publicOrigin(request) {
  const proto = request.headers["x-forwarded-proto"] || (isProductionRuntime() ? "https" : "http");
  const hostHeader = request.headers["x-forwarded-host"] || request.headers.host || `${host}:${port}`;
  return `${String(proto).split(",")[0]}://${String(hostHeader).split(",")[0]}`;
}

function supabaseAuthConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

function redirect(response, location, headers = {}) {
  response.writeHead(302, { Location: location, ...headers });
  response.end();
}

async function fetchSupabaseUser(accessToken) {
  if (!supabaseAuthConfigured()) throw new Error("Supabase Auth is not configured.");
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${accessToken}`,
    },
    signal: AbortSignal.timeout(10000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.msg || payload.error_description || payload.error || "Supabase user verification failed");
  const email = String(payload.email || payload.user_metadata?.email || "").toLowerCase();
  if (!email) throw new Error("Supabase did not return a verified email address");
  return {
    email,
    name: payload.user_metadata?.full_name || payload.user_metadata?.name || email.split("@")[0],
    avatarUrl: payload.user_metadata?.avatar_url || null,
    supabaseUserId: payload.id,
    provider: payload.app_metadata?.provider || "supabase",
  };
}

async function sendSupabaseMagicLink(email, redirectTo) {
  if (!supabaseAuthConfigured()) throw new Error("Supabase Auth is not configured.");
  const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      create_user: true,
      options: { email_redirect_to: redirectTo },
    }),
    signal: AbortSignal.timeout(10000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.msg || payload.error_description || payload.error || "Magic link request failed");
  return true;
}

function clientIp(request) {
  return String(request.headers["x-forwarded-for"] || request.socket.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
}

function allowCompanyFetch(request) {
  const ip = clientIp(request);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const recent = (fetchAttempts.get(ip) || []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= 5) return false;
  recent.push(now);
  fetchAttempts.set(ip, recent);
  return true;
}

function allowSummaryGeneration(request) {
  const ip = clientIp(request);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const recent = (summaryAttempts.get(ip) || []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= 5) return false;
  recent.push(now);
  summaryAttempts.set(ip, recent);
  return true;
}

function parseFreshnessDate(value) {
  if (!value) return null;
  const text = String(value).trim();
  let parsed = new Date(text);
  if (!Number.isFinite(parsed.getTime()) && /\sET$/i.test(text)) {
    parsed = new Date(text.replace(/\sET$/i, ""));
  }
  return Number.isFinite(parsed.getTime()) ? parsed : null;
}

function marketDateKey(date = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function quoteFreshness(company) {
  const quoteAsOf = company?.sources?.quoteAsOf || company?.quoteAsOf || null;
  const parsed = parseFreshnessDate(quoteAsOf);
  if (!parsed) {
    return {
      status: "missing-date",
      label: "Quote date unavailable",
      quoteAsOf,
      displayable: false,
    };
  }
  const quoteDateKey = marketDateKey(parsed);
  const todayKey = marketDateKey();
  const ageDays = (Date.now() - parsed.getTime()) / 86400000;
  const stale = Number.isFinite(ageDays) && ageDays > quoteMaxAgeDays;
  const current = quoteDateKey === todayKey;
  return {
    status: stale ? "stale" : current ? "current" : "previous-close",
    label: stale ? "Quote may be stale" : current ? "Today quote" : "Previous close",
    quoteAsOf,
    quoteDate: quoteDateKey,
    todayDate: todayKey,
    ageDays: Number.isFinite(ageDays) ? Number(ageDays.toFixed(1)) : null,
    displayable: !stale,
  };
}

function sanitizeCompanyForRead(company) {
  if (!company?.ticker) return company;
  const freshness = quoteFreshness(company);
  const sources = { ...(company.sources || {}), quoteFreshness: freshness };
  if (freshness.displayable) return { ...company, sources };
  return {
    ...company,
    price: null,
    change: 0,
    cap: "Quote key required",
    sources,
  };
}

function dashboardAgeHours(payload) {
  const generatedAt = parseFreshnessDate(payload?.generatedAt);
  if (!generatedAt) return Infinity;
  return (Date.now() - generatedAt.getTime()) / 3600000;
}

function prepareDashboardForRead(payload) {
  const ageHours = dashboardAgeHours(payload);
  const dashboardStale = Number.isFinite(ageHours) && ageHours > dashboardMaxAgeHours;
  const companies = Object.fromEntries(
    Object.entries(payload?.companies || {}).map(([ticker, company]) => [ticker, sanitizeCompanyForRead(company)]),
  );
  const staleQuotes = Object.values(companies)
    .filter((company) => company.sources?.quoteFreshness && !company.sources.quoteFreshness.displayable)
    .map((company) => company.ticker);
  return {
    ...payload,
    companies,
    freshness: {
      ...(payload?.freshness || {}),
      dashboardStatus: dashboardStale ? "stale" : "fresh",
      dashboardAgeHours: Number.isFinite(ageHours) ? Number(ageHours.toFixed(1)) : null,
      maxDashboardAgeHours: dashboardMaxAgeHours,
      staleQuotes,
    },
  };
}

async function fetchNasdaqNews(ticker) {
  const query = encodeURIComponent(`${ticker}|stocks`);
  const response = await fetch(
    `https://api.nasdaq.com/api/news/topic/articlebysymbol?q=${query}&offset=0&limit=8`,
    {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Northstar Stock Intelligence)", Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    },
  );
  if (!response.ok) throw new Error(`Nasdaq news returned HTTP ${response.status}`);
  const payload = await response.json();
  return (payload.data?.rows || []).slice(0, 8).map((item) => ({
    title: item.title,
    description: item.description || "",
    publisher: item.publisher || "Nasdaq",
    published: item.ago || item.created || "",
    publishedAt: item.created || item.date || null,
    url: item.url?.startsWith("http") ? item.url : `https://www.nasdaq.com${item.url || ""}`,
  }));
}

function parseNewsTime(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isFinite(parsed.getTime()) ? parsed.toISOString() : null;
}

function newsFreshness(news, newsStatus, fetchedAt) {
  const latestPublishedAt = news
    .map((item) => parseNewsTime(item.publishedAt))
    .filter(Boolean)
    .sort()
    .at(-1) || null;
  const ageHours = latestPublishedAt
    ? (Date.now() - new Date(latestPublishedAt).getTime()) / 3600000
    : null;
  return {
    provider: "Nasdaq",
    status: newsStatus,
    label: newsStatus === "available"
      ? latestPublishedAt && ageHours > 72 ? "News may be stale" : "Latest fetched"
      : "News unavailable",
    fetchedAt,
    latestPublishedAt,
    headlineCount: news.length,
  };
}

async function fetchXPosts(ticker) {
  if (!xBearerToken) return { status: "unconfigured", posts: [] };
  const params = new URLSearchParams({
    query: `$${ticker} -is:retweet lang:en`,
    max_results: "10",
    expansions: "author_id",
    "tweet.fields": "created_at,public_metrics",
    "user.fields": "name,username,verified",
  });
  const response = await fetch(`https://api.x.com/2/tweets/search/recent?${params}`, {
    headers: { Authorization: `Bearer ${xBearerToken}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) return { status: "unavailable", posts: [] };
  const payload = await response.json();
  const users = new Map((payload.includes?.users || []).map((user) => [user.id, user]));
  return {
    status: "available",
    posts: (payload.data || []).map((post) => {
      const author = users.get(post.author_id) || {};
      return {
        id: post.id,
        text: post.text,
        createdAt: post.created_at,
        authorName: author.name || author.username || "X user",
        username: author.username || null,
        verified: Boolean(author.verified),
        likes: post.public_metrics?.like_count ?? 0,
        reposts: post.public_metrics?.retweet_count ?? 0,
        url: author.username ? `https://x.com/${author.username}/status/${post.id}` : `https://x.com/i/web/status/${post.id}`,
      };
    }),
  };
}

async function tickerContent(ticker, force = false) {
  const cached = tickerContentCache.get(ticker);
  const cacheAge = cached ? Date.now() - cached.cachedAt : Infinity;
  if (cached && (cacheAge < 30 * 1000 || (!force && cacheAge < 15 * 60 * 1000))) return cached.payload;
  const [newsResult, xResult] = await Promise.allSettled([fetchNasdaqNews(ticker), fetchXPosts(ticker)]);
  const fetchedAt = new Date().toISOString();
  const news = newsResult.status === "fulfilled" ? newsResult.value : [];
  const newsStatus = newsResult.status === "fulfilled" ? "available" : "unavailable";
  const payload = {
    ticker,
    news,
    newsStatus,
    newsFreshness: newsFreshness(news, newsStatus, fetchedAt),
    x: xResult.status === "fulfilled" ? xResult.value : { status: "unavailable", posts: [] },
    xSearchUrl: `https://x.com/search?q=${encodeURIComponent(`$${ticker}`)}&src=typed_query&f=live`,
    fetchedAt,
  };
  tickerContentCache.set(ticker, { cachedAt: Date.now(), payload });
  return payload;
}

async function fetchTickerDirectory() {
  if (tickerDirectory) return tickerDirectory;

  try {
    const response = await fetch("https://www.sec.gov/files/company_tickers_exchange.json", {
      headers: secIdentity ? { "User-Agent": secIdentity } : {},
    });
    if (!response.ok) throw new Error(`SEC returned HTTP ${response.status}`);
    const payload = await response.json();
    const fields = payload.fields || [];
    tickerDirectory = (payload.data || []).map((row) => {
      const item = Object.fromEntries(fields.map((field, index) => [field, row[index]]));
      return {
        ticker: String(item.ticker || "").toUpperCase(),
        name: item.name,
        cik: String(item.cik || "").padStart(10, "0"),
        exchange: item.exchange || "US",
      };
    });
    await writeFile(tickerCachePath, `${JSON.stringify(tickerDirectory)}\n`);
    return tickerDirectory;
  } catch (error) {
    tickerDirectory = await readFile(tickerCachePath, "utf8").then(JSON.parse).catch(() => null);
    if (tickerDirectory) return tickerDirectory;
    throw new Error(`Ticker directory unavailable: ${error.message}`);
  }
}

async function readDashboardData() {
  if (isProductionRuntime() && !isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is required in production; JSON fallback is development-only.");
  }
  try {
    const stored = await loadDashboardSnapshot();
    if (stored?.companies && Object.keys(stored.companies).length) {
      const prepared = prepareDashboardForRead(stored);
      if (prepared.freshness?.dashboardStatus === "stale" || prepared.freshness?.staleQuotes?.length) {
        scheduleDashboardRefresh("stale dashboard or undated quotes");
      }
      return { ...prepared, storage: "postgres" };
    }
  } catch (error) {
    if (isProductionRuntime()) throw error;
    console.warn(`Postgres dashboard load failed; using JSON fallback: ${error.message}`);
  }
  if (isProductionRuntime()) {
    throw new Error("Postgres dashboard snapshot is unavailable in production.");
  }
  return readFile(dashboardPath, "utf8").then(JSON.parse);
}

function summaryCacheKey(filing) {
  return `${filing.ticker}:${filing.accessionNumber}:${reportSummaryPromptVersion}`;
}

async function loadSharedFilingSummary(filing) {
  const key = summaryCacheKey(filing);
  if (isDatabaseConfigured()) {
    return loadFilingSummary(filing.ticker, filing.accessionNumber, reportSummaryPromptVersion);
  }
  return summaryMemoryCache.get(key) || null;
}

async function saveSharedFilingSummary(record) {
  if (isDatabaseConfigured()) return saveFilingSummary(record);
  summaryMemoryCache.set(summaryCacheKey(record), record);
  return true;
}

async function quarterlySummaryContext(ticker) {
  const normalized = ticker.toUpperCase();
  const dashboard = await readDashboardData();
  const company = dashboard.companies?.[normalized];
  if (!company) throw new Error(`Ticker ${normalized} is not currently tracked`);
  const filing = await resolveQuarterlyFiling(company, { secIdentity });
  if (!filing) return { company, filing: null, cached: null };
  return { company, filing, cached: await loadSharedFilingSummary(filing) };
}

async function quarterlySummaryStatus(ticker) {
  const { filing, cached } = await quarterlySummaryContext(ticker);
  if (!filing) {
    return {
      status: "unavailable",
      llmConfigured: Boolean(openaiApiKey),
      message: "No quarterly SEC filing is available for this ticker.",
    };
  }
  return {
    status: cached ? "cached" : "missing",
    llmConfigured: Boolean(openaiApiKey),
    filing,
    record: cached,
  };
}

async function createQuarterlySummary(ticker) {
  const { company, filing, cached } = await quarterlySummaryContext(ticker);
  if (!filing) throw new Error("No quarterly SEC filing is available for this ticker.");
  if (cached) return { status: "cached", llmConfigured: Boolean(openaiApiKey), filing, record: cached };
  if (!openaiApiKey) throw new Error("OPENAI_API_KEY is not configured");
  const key = summaryCacheKey(filing);
  if (!summaryTasks.has(key)) {
    const task = (async () => {
      const existing = await loadSharedFilingSummary(filing);
      if (existing) return existing;
      const generated = await generateQuarterlySummary(company, filing, {
        openaiKey: openaiApiKey,
        model: openaiSummaryModel,
        secIdentity,
      });
      const record = {
        ticker: filing.ticker,
        accessionNumber: filing.accessionNumber,
        promptVersion: reportSummaryPromptVersion,
        reportPeriod: filing.fiscalPeriod || filing.reportDate,
        filedAt: filing.filed,
        sourceUrl: filing.sourceUrl,
        sourceHash: generated.sourceHash,
        model: generated.model,
        summary: generated.payload,
        createdAt: new Date().toISOString(),
      };
      await saveSharedFilingSummary(record);
      return record;
    })().finally(() => summaryTasks.delete(key));
    summaryTasks.set(key, task);
  }
  const record = await summaryTasks.get(key);
  return { status: "generated", llmConfigured: true, filing, record };
}

async function readWatchlistData() {
  if (isProductionRuntime()) return loadWatchlistItems();
  const fileWatchlist = await readFile(watchlistPath, "utf8").then(JSON.parse);
  try {
    const storedWatchlist = await loadWatchlistItems();
    const byTicker = new Map(fileWatchlist.map((item) => [item.ticker, item]));
    for (const item of storedWatchlist) byTicker.set(item.ticker, item);
    return [...byTicker.values()];
  } catch (error) {
    console.warn(`Postgres watchlist load failed; using JSON fallback: ${error.message}`);
    return fileWatchlist;
  }
}

async function writeWatchlistData(items) {
  if (isProductionRuntime()) {
    await saveWatchlistItems(items);
    return;
  }
  await writeFile(watchlistPath, `${JSON.stringify(items, null, 2)}\n`);
  try {
    await saveWatchlistItems(items);
  } catch (error) {
    console.warn(`Postgres watchlist save failed; JSON file still updated: ${error.message}`);
  }
}

function searchTickers(directory, query) {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return [];
  return directory
    .filter((item) =>
      item.ticker.includes(normalized) || item.name.toUpperCase().includes(normalized),
    )
    .sort((a, b) => {
      const aRank = a.ticker === normalized ? 0 : a.ticker.startsWith(normalized) ? 1 : 2;
      const bRank = b.ticker === normalized ? 0 : b.ticker.startsWith(normalized) ? 1 : 2;
      return aRank - bRank || a.ticker.localeCompare(b.ticker);
    })
    .slice(0, 10);
}

async function runRefresh(ticker = null) {
  if (!secIdentity) {
    throw new Error("SEC_USER_AGENT is required to download new company data");
  }

  await new Promise((resolvePromise, reject) => {
    const env = ticker ? { ...process.env, REFRESH_TICKER: ticker } : process.env;
    const child = spawn(process.execPath, ["scripts/refresh-data.mjs"], {
      cwd: root,
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => { output += chunk; });
    child.stderr.on("data", (chunk) => { output += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolvePromise();
      else reject(new Error(output.trim() || `Refresh exited with code ${code}`));
    });
  });
}

function scheduleDashboardRefresh(reason) {
  if (backgroundRefreshStarted || !isProductionRuntime() || !secIdentity) return;
  const now = Date.now();
  if (now - lastBackgroundRefreshAt < 30 * 60 * 1000) return;
  lastBackgroundRefreshAt = now;
  backgroundRefreshStarted = true;
  const task = refreshQueue.then(async () => {
    const refreshJobId = await createRefreshJob("ALL");
    try {
      console.log(`Starting background dashboard refresh: ${reason}`);
      await runRefresh();
      await finishRefreshJob(refreshJobId, "succeeded");
    } catch (error) {
      console.warn(`Background dashboard refresh failed: ${error.message}`);
      await finishRefreshJob(refreshJobId, "failed", error.message);
    } finally {
      backgroundRefreshStarted = false;
    }
  });
  refreshQueue = task.catch(() => {});
}

async function refreshStaleDashboardOnStartup() {
  if (!isProductionRuntime() || !isDatabaseConfigured() || !secIdentity) return;
  const stored = await loadDashboardSnapshot().catch(() => null);
  if (!stored?.companies || !Object.keys(stored.companies).length) {
    scheduleDashboardRefresh("missing production dashboard snapshot");
    return;
  }
  const prepared = prepareDashboardForRead(stored);
  if (prepared.freshness?.dashboardStatus === "stale" || prepared.freshness?.staleQuotes?.length) {
    scheduleDashboardRefresh("startup stale dashboard or undated quotes");
  }
}

async function addCompany(ticker) {
  const normalized = ticker.toUpperCase();
  const directory = await fetchTickerDirectory();
  const listing = directory.find((item) => item.ticker === normalized);
  if (!listing) throw new Error(`Ticker ${normalized} was not found in the SEC directory`);

  const watchlist = await readWatchlistData();
  const alreadyTracked = watchlist.some((item) => item.ticker === normalized);
  let refreshJobId = null;
  if (!alreadyTracked) {
    watchlist.push({
      ticker: listing.ticker,
      cik: listing.cik,
      sector: "Unclassified",
      industry: "SEC registrant",
      exchange: listing.exchange,
    });
  }

  const fileHasTicker = isProductionRuntime()
    ? true
    : (await readFile(watchlistPath, "utf8").then(JSON.parse)).some((item) => item.ticker === normalized);
  if (!alreadyTracked || !fileHasTicker) {
    await writeWatchlistData(watchlist);
  } else {
    await saveWatchlistItem(watchlist.find((item) => item.ticker === normalized));
  }

  try {
    refreshJobId = await createRefreshJob(normalized);
    await runRefresh(normalized);
    await finishRefreshJob(refreshJobId, "succeeded");
  } catch (error) {
    if (!alreadyTracked) {
      const restored = watchlist.filter((item) => item.ticker !== normalized);
      await writeWatchlistData(restored);
    }
    await finishRefreshJob(refreshJobId, "failed", error.message);
    throw error;
  }
  const dashboard = await loadDashboardSnapshot()
    || (isProductionRuntime() ? null : await readFile(dashboardPath, "utf8").then(JSON.parse));
  if (!dashboard) throw new Error("Postgres dashboard snapshot is unavailable after refresh");
  try {
    await saveDashboardSnapshot(dashboard);
  } catch (error) {
    console.warn(`Postgres dashboard save failed; JSON file still updated: ${error.message}`);
  }
  const company = dashboard.companies?.[normalized];
  if (!company) throw new Error(`SEC financial statements are not available for ${normalized}`);
  return { company, peers: dashboard.peers, generatedAt: dashboard.generatedAt };
}

async function refreshExistingCompany(ticker) {
  const normalized = ticker.toUpperCase();
  const dashboardBefore = await readDashboardData();
  if (!dashboardBefore.companies?.[normalized]) {
    throw new Error(`Ticker ${normalized} is not currently tracked`);
  }

  const refreshJobId = await createRefreshJob(normalized);
  try {
    await runRefresh(normalized);
    const dashboard = await loadDashboardSnapshot()
      || (isProductionRuntime() ? null : await readFile(dashboardPath, "utf8").then(JSON.parse));
    if (!dashboard?.companies?.[normalized]) {
      throw new Error(`Refresh finished, but ${normalized} is missing from the dashboard snapshot`);
    }
    await saveDashboardSnapshot(dashboard);
    await finishRefreshJob(refreshJobId, "succeeded");
    const finishedAt = new Date().toISOString();
    return {
      company: dashboard.companies[normalized],
      peers: dashboard.peers,
      generatedAt: dashboard.generatedAt,
      job: { id: refreshJobId, ticker: normalized, status: "succeeded", finishedAt },
    };
  } catch (error) {
    await finishRefreshJob(refreshJobId, "failed", error.message);
    throw error;
  }
}

async function serveStatic(pathname, response) {
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  if (!allowedStaticFiles.has(requested)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  const filePath = normalize(join(root, requested));
  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || `${host}:${port}`}`);

  try {
    if (request.method === "GET" && url.pathname === "/health") {
      json(response, 200, { status: "ok" });
      return;
    }

    if (request.method === "GET" && url.pathname === "/auth/supabase/google/start") {
      if (!supabaseAuthConfigured()) {
        const message = encodeURIComponent("Google sign-in is not configured yet. Add the Supabase environment variables in Render.");
        redirect(response, `/?signin_error=${message}`);
        return;
      }
      const redirectTo = `${publicOrigin(request)}/`;
      const params = new URLSearchParams({
        provider: "google",
        redirect_to: redirectTo,
      });
      redirect(response, `${supabaseUrl}/auth/v1/authorize?${params}`);
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/session") {
      json(response, 200, {
        user: publicSession(sessionFromRequest(request)),
        auth: {
          configured: Boolean(authSecret),
          supabaseConfigured: supabaseAuthConfigured(),
          inviteRequired: Boolean(inviteCode),
          storage: isDatabaseConfigured() ? "postgres" : "local-development",
        },
      });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/session") {
      if (isProductionRuntime()) {
        json(response, 503, { error: "Verified sign-in is not configured. Add Supabase Auth in Render." });
        return;
      }
      const body = await readJsonBody(request);
      const email = String(body.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        json(response, 400, { error: "Enter a valid email address." });
        return;
      }
      if (inviteCode && String(body.inviteCode || "") !== inviteCode) {
        json(response, 401, { error: "Invite code is incorrect." });
        return;
      }
      if (isProductionRuntime() && !isDatabaseConfigured()) {
        json(response, 503, { error: "Postgres is required for production sign in." });
        return;
      }
      const session = {
        email,
        userKey: userKeyForEmail(email),
        issuedAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      };
      await upsertUser({ userKey: session.userKey, email });
      jsonWithHeaders(response, 200, { user: publicSession(session) }, sessionHeaders(session));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/session/supabase") {
      const body = await readJsonBody(request);
      const accessToken = String(body.accessToken || "");
      if (!accessToken) {
        json(response, 400, { error: "Supabase access token is required." });
        return;
      }
      if (isProductionRuntime() && !isDatabaseConfigured()) {
        json(response, 503, { error: "Postgres is required for production sign in." });
        return;
      }
      const identity = await fetchSupabaseUser(accessToken);
      const session = {
        email: identity.email,
        userKey: userKeyForEmail(identity.email),
        provider: identity.provider === "google" ? "google" : "supabase",
        name: identity.name,
        avatarUrl: identity.avatarUrl,
        supabaseUserId: identity.supabaseUserId,
        issuedAt: Date.now(),
        expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30,
      };
      await upsertUser({ userKey: session.userKey, email: session.email, displayName: session.name });
      jsonWithHeaders(response, 200, { user: publicSession(session) }, sessionHeaders(session));
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/auth/supabase/magic-link") {
      const body = await readJsonBody(request);
      const email = String(body.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        json(response, 400, { error: "Enter a valid email address." });
        return;
      }
      if (inviteCode && String(body.inviteCode || "") !== inviteCode) {
        json(response, 401, { error: "Invite code is incorrect." });
        return;
      }
      await sendSupabaseMagicLink(email, `${publicOrigin(request)}/`);
      json(response, 200, { ok: true });
      return;
    }

    if (request.method === "DELETE" && url.pathname === "/api/session") {
      jsonWithHeaders(response, 200, { user: null }, sessionHeaders(null));
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/me/watchlist") {
      const session = sessionFromRequest(request);
      if (!session) {
        json(response, 401, { error: "Sign in required." });
        return;
      }
      json(response, 200, { watchlist: await loadUserWatchlistItems(session.userKey) });
      return;
    }

    if (request.method === "PUT" && url.pathname === "/api/me/watchlist") {
      const session = sessionFromRequest(request);
      if (!session) {
        json(response, 401, { error: "Sign in required." });
        return;
      }
      const body = await readJsonBody(request);
      const items = Array.isArray(body.watchlist) ? body.watchlist : [];
      await saveUserWatchlistItems(session.userKey, items);
      json(response, 200, { watchlist: await loadUserWatchlistItems(session.userKey) });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/me/preferences") {
      const session = sessionFromRequest(request);
      if (!session) {
        json(response, 401, { error: "Sign in required." });
        return;
      }
      json(response, 200, {
        hiddenMetrics: await loadUserPreference(session.userKey, "hiddenMetrics") || {},
        metricDisplay: await loadUserPreference(session.userKey, "metricDisplay") || {},
        selectedPeriod: await loadUserPreference(session.userKey, "selectedPeriod") || null,
      });
      return;
    }

    if (request.method === "PUT" && url.pathname === "/api/me/preferences") {
      const session = sessionFromRequest(request);
      if (!session) {
        json(response, 401, { error: "Sign in required." });
        return;
      }
      const body = await readJsonBody(request);
      await saveUserPreference(session.userKey, "hiddenMetrics", body.hiddenMetrics || {});
      await saveUserPreference(session.userKey, "metricDisplay", body.metricDisplay || {});
      if (["annual", "quarterly"].includes(body.selectedPeriod)) {
        await saveUserPreference(session.userKey, "selectedPeriod", body.selectedPeriod);
      }
      json(response, 200, { ok: true });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/tickers") {
      const directory = await fetchTickerDirectory();
      json(response, 200, { results: searchTickers(directory, url.searchParams.get("q") || "") });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/dashboard") {
      json(response, 200, await readDashboardData());
      return;
    }

    const summaryMatch = url.pathname.match(/^\/api\/quarter-summary\/([A-Z0-9.-]+)$/i);
    if (request.method === "GET" && summaryMatch) {
      json(response, 200, await quarterlySummaryStatus(summaryMatch[1]));
      return;
    }

    if (request.method === "POST" && summaryMatch) {
      const current = await quarterlySummaryStatus(summaryMatch[1]);
      if (current.status === "cached") {
        json(response, 200, current);
        return;
      }
      if (!current.llmConfigured) {
        json(response, 503, { ...current, error: "Quarterly AI summaries are not configured yet." });
        return;
      }
      if (!allowSummaryGeneration(request)) {
        json(response, 429, { error: "Too many summary requests. Try again later." });
        return;
      }
      json(response, 200, await createQuarterlySummary(summaryMatch[1]));
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/refresh/status") {
      json(response, 200, { jobs: await listRefreshJobs(12) });
      return;
    }

    if (request.method === "POST" && url.pathname === "/api/refresh") {
      if (!allowCompanyFetch(request)) {
        json(response, 429, { error: "Too many refresh requests. Try again in 10 minutes." });
        return;
      }
      const refreshJobId = await createRefreshJob("ALL");
      const task = refreshQueue.then(async () => {
        try {
          await runRefresh();
          await finishRefreshJob(refreshJobId, "succeeded");
          const dashboard = await loadDashboardSnapshot();
          return { dashboard, job: { id: refreshJobId, ticker: "ALL", status: "succeeded", finishedAt: new Date().toISOString() } };
        } catch (error) {
          await finishRefreshJob(refreshJobId, "failed", error.message);
          throw error;
        }
      });
      refreshQueue = task.catch(() => {});
      json(response, 200, await task);
      return;
    }

    const contentMatch = request.method === "GET" && url.pathname.match(/^\/api\/content\/([A-Z0-9.-]+)$/i);
    if (contentMatch) {
      json(response, 200, await tickerContent(contentMatch[1].toUpperCase(), url.searchParams.get("refresh") === "1"));
      return;
    }

    const addMatch = request.method === "POST" && url.pathname.match(/^\/api\/companies\/([A-Z0-9.-]+)$/i);
    if (addMatch) {
      if (!allowCompanyFetch(request)) {
        json(response, 429, { error: "Too many company downloads. Try again in 10 minutes." });
        return;
      }
      const ticker = addMatch[1].toUpperCase();
      const task = refreshQueue.then(() => addCompany(ticker));
      refreshQueue = task.catch(() => {});
      json(response, 200, await task);
      return;
    }

    const refreshMatch = request.method === "POST" && url.pathname.match(/^\/api\/refresh\/([A-Z0-9.-]+)$/i);
    if (refreshMatch) {
      if (!allowCompanyFetch(request)) {
        json(response, 429, { error: "Too many refresh requests. Try again in 10 minutes." });
        return;
      }
      const ticker = refreshMatch[1].toUpperCase();
      const task = refreshQueue.then(() => refreshExistingCompany(ticker));
      refreshQueue = task.catch(() => {});
      json(response, 200, await task);
      return;
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      json(response, 405, { error: "Method not allowed" });
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    json(response, 500, { error: error.message });
  }
});

async function startServer() {
  if (isProductionRuntime() && !isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is required in production; JSON fallback is development-only.");
  }
  if (isDatabaseConfigured()) {
    await seedDatabaseFromFiles({ dashboardPath, watchlistPath });
    console.log("Postgres persistence is enabled.");
    await refreshStaleDashboardOnStartup();
  }
  server.listen(port, host, () => {
    console.log(`Northstar running at http://localhost:${port}`);
    if (!secIdentity) {
      console.warn("SEC_USER_AGENT is not set. Cached data works, but adding new tickers will fail.");
    }
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  startServer().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

export {
  marketDateKey,
  parseFreshnessDate,
  prepareDashboardForRead,
  quoteFreshness,
  sanitizeCompanyForRead,
};
