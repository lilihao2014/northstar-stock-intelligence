import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";
import {
  createRefreshJob,
  finishRefreshJob,
  isDatabaseConfigured,
  loadDashboardSnapshot,
  loadWatchlistItems,
  saveDashboardSnapshot,
  saveWatchlistItem,
  saveWatchlistItems,
  seedDatabaseFromFiles,
} from "./db.mjs";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const secIdentity = process.env.SEC_USER_AGENT;
const xBearerToken = process.env.X_BEARER_TOKEN;
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
const fetchAttempts = new Map();
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
    url: item.url?.startsWith("http") ? item.url : `https://www.nasdaq.com${item.url || ""}`,
  }));
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
  const payload = {
    ticker,
    news: newsResult.status === "fulfilled" ? newsResult.value : [],
    newsStatus: newsResult.status === "fulfilled" ? "available" : "unavailable",
    x: xResult.status === "fulfilled" ? xResult.value : { status: "unavailable", posts: [] },
    xSearchUrl: `https://x.com/search?q=${encodeURIComponent(`$${ticker}`)}&src=typed_query&f=live`,
    fetchedAt: new Date().toISOString(),
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
  try {
    const stored = await loadDashboardSnapshot();
    if (stored?.companies && Object.keys(stored.companies).length) {
      return { ...stored, storage: "postgres" };
    }
  } catch (error) {
    console.warn(`Postgres dashboard load failed; using JSON fallback: ${error.message}`);
  }
  return readFile(dashboardPath, "utf8").then(JSON.parse);
}

async function readWatchlistData() {
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

async function runRefresh(ticker) {
  if (!secIdentity) {
    throw new Error("SEC_USER_AGENT is required to download new company data");
  }

  await new Promise((resolvePromise, reject) => {
    const child = spawn(process.execPath, ["scripts/refresh-data.mjs"], {
      cwd: root,
      env: { ...process.env, REFRESH_TICKER: ticker },
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

  const fileWatchlist = await readFile(watchlistPath, "utf8").then(JSON.parse);
  const fileHasTicker = fileWatchlist.some((item) => item.ticker === normalized);
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
  const dashboard = JSON.parse(await readFile(dashboardPath, "utf8"));
  try {
    await saveDashboardSnapshot(dashboard);
  } catch (error) {
    console.warn(`Postgres dashboard save failed; JSON file still updated: ${error.message}`);
  }
  const company = dashboard.companies?.[normalized];
  if (!company) throw new Error(`SEC financial statements are not available for ${normalized}`);
  return { company, peers: dashboard.peers, generatedAt: dashboard.generatedAt };
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

    if (request.method === "GET" && url.pathname === "/api/tickers") {
      const directory = await fetchTickerDirectory();
      json(response, 200, { results: searchTickers(directory, url.searchParams.get("q") || "") });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api/dashboard") {
      json(response, 200, await readDashboardData());
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

    if (request.method !== "GET" && request.method !== "HEAD") {
      json(response, 405, { error: "Method not allowed" });
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    json(response, 500, { error: error.message });
  }
});

server.listen(port, host, () => {
  console.log(`Northstar running at http://localhost:${port}`);
  if (isDatabaseConfigured()) {
    seedDatabaseFromFiles({ dashboardPath, watchlistPath })
      .then(() => console.log("Postgres persistence is enabled."))
      .catch((error) => console.warn(`Postgres initialization failed; JSON fallback remains available: ${error.message}`));
  }
  if (!secIdentity) {
    console.warn("SEC_USER_AGENT is not set. Cached data works, but adding new tickers will fail.");
  }
});
