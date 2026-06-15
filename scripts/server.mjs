import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFile, writeFile } from "node:fs/promises";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";
const secIdentity = process.env.SEC_USER_AGENT;
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

  const watchlist = JSON.parse(await readFile(watchlistPath, "utf8"));
  const alreadyTracked = watchlist.some((item) => item.ticker === normalized);
  if (!alreadyTracked) {
    watchlist.push({
      ticker: listing.ticker,
      cik: listing.cik,
      sector: "Unclassified",
      industry: "SEC registrant",
      exchange: listing.exchange,
    });
    await writeFile(watchlistPath, `${JSON.stringify(watchlist, null, 2)}\n`);
  }

  try {
    await runRefresh(normalized);
  } catch (error) {
    if (!alreadyTracked) {
      const restored = watchlist.filter((item) => item.ticker !== normalized);
      await writeFile(watchlistPath, `${JSON.stringify(restored, null, 2)}\n`);
    }
    throw error;
  }
  const dashboard = JSON.parse(await readFile(dashboardPath, "utf8"));
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
  if (!secIdentity) {
    console.warn("SEC_USER_AGENT is not set. Cached data works, but adding new tickers will fail.");
  }
});
