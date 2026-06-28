import { readFile } from "node:fs/promises";

let poolPromise = null;
let schemaReady = false;

export function databaseUrl() {
  return process.env.DATABASE_URL || "";
}

export function isDatabaseConfigured() {
  return Boolean(databaseUrl());
}

export function isProductionRuntime() {
  return process.env.NODE_ENV === "production" || process.env.APP_ENV === "production";
}

async function getPool() {
  if (!isDatabaseConfigured()) return null;
  if (!poolPromise) {
    poolPromise = import("pg").then(({ Pool }) => new Pool({
      connectionString: databaseUrl(),
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    }));
  }
  return poolPromise;
}

export async function query(sql, params = []) {
  const pool = await getPool();
  if (!pool) throw new Error("DATABASE_URL is not configured");
  return pool.query(sql, params);
}

export async function ensureDatabase() {
  if (!isDatabaseConfigured() || schemaReady) return false;
  await query(`
    create table if not exists app_state (
      key text primary key,
      payload jsonb not null,
      updated_at timestamptz not null default now()
    );

    create table if not exists companies (
      ticker text primary key,
      name text,
      cik text,
      sector text,
      industry text,
      exchange text,
      payload jsonb not null,
      refreshed_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists watchlist_items (
      ticker text primary key,
      cik text,
      sector text,
      industry text,
      exchange text,
      payload jsonb not null,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table if not exists metric_preferences (
      user_key text not null default 'default',
      ticker text not null,
      metric_key text not null,
      hidden boolean not null default true,
      updated_at timestamptz not null default now(),
      primary key (user_key, ticker, metric_key)
    );

    create table if not exists refresh_jobs (
      id bigserial primary key,
      ticker text,
      status text not null,
      message text,
      started_at timestamptz not null default now(),
      finished_at timestamptz
    );

    create table if not exists provider_cache (
      cache_key text primary key,
      provider text not null,
      payload jsonb not null,
      expires_at timestamptz,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );
  `);
  schemaReady = true;
  return true;
}

export async function loadDashboardSnapshot() {
  if (!isDatabaseConfigured()) return null;
  await ensureDatabase();
  const result = await query("select payload from app_state where key = $1", ["dashboard"]);
  return result.rows[0]?.payload ?? null;
}

export async function saveDashboardSnapshot(payload) {
  if (!isDatabaseConfigured() || !payload?.companies) return false;
  await ensureDatabase();
  await query(
    `insert into app_state (key, payload, updated_at)
     values ($1, $2::jsonb, now())
     on conflict (key) do update set payload = excluded.payload, updated_at = now()`,
    ["dashboard", JSON.stringify(payload)],
  );

  for (const company of Object.values(payload.companies || {})) {
    await saveCompanySnapshot(company, payload.generatedAt);
  }
  return true;
}

export async function saveCompanySnapshot(company, refreshedAt = null) {
  if (!isDatabaseConfigured() || !company?.ticker) return false;
  await ensureDatabase();
  const meta = company.meta || {};
  await query(
    `insert into companies (ticker, name, cik, sector, industry, exchange, payload, refreshed_at, updated_at)
     values ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, now())
     on conflict (ticker) do update set
       name = excluded.name,
       cik = excluded.cik,
       sector = excluded.sector,
       industry = excluded.industry,
       exchange = excluded.exchange,
       payload = excluded.payload,
       refreshed_at = excluded.refreshed_at,
       updated_at = now()`,
    [
      company.ticker,
      company.name || null,
      meta.cik || null,
      meta.sector || null,
      meta.industry || null,
      meta.exchange || null,
      JSON.stringify(company),
      refreshedAt,
    ],
  );
  return true;
}

export async function loadWatchlistItems() {
  if (!isDatabaseConfigured()) return [];
  await ensureDatabase();
  const result = await query("select payload from watchlist_items order by created_at, ticker");
  return result.rows.map((row) => row.payload);
}

export async function saveWatchlistItem(item) {
  if (!isDatabaseConfigured() || !item?.ticker) return false;
  await ensureDatabase();
  await query(
    `insert into watchlist_items (ticker, cik, sector, industry, exchange, payload, updated_at)
     values ($1, $2, $3, $4, $5, $6::jsonb, now())
     on conflict (ticker) do update set
       cik = excluded.cik,
       sector = excluded.sector,
       industry = excluded.industry,
       exchange = excluded.exchange,
       payload = excluded.payload,
       updated_at = now()`,
    [
      item.ticker,
      item.cik || null,
      item.sector || null,
      item.industry || null,
      item.exchange || null,
      JSON.stringify(item),
    ],
  );
  return true;
}

export async function saveWatchlistItems(items) {
  if (!isDatabaseConfigured()) return false;
  await ensureDatabase();
  for (const item of items || []) await saveWatchlistItem(item);
  return true;
}

export async function createRefreshJob(ticker) {
  if (!isDatabaseConfigured()) return null;
  await ensureDatabase();
  const result = await query(
    "insert into refresh_jobs (ticker, status) values ($1, $2) returning id",
    [ticker || null, "running"],
  );
  return result.rows[0]?.id ?? null;
}

export async function finishRefreshJob(id, status, message = null) {
  if (!isDatabaseConfigured() || !id) return false;
  await query(
    "update refresh_jobs set status = $2, message = $3, finished_at = now() where id = $1",
    [id, status, message],
  );
  return true;
}

export async function listRefreshJobs(limit = 10) {
  if (!isDatabaseConfigured()) return [];
  await ensureDatabase();
  const result = await query(
    `select id, ticker, status, message, started_at, finished_at
     from refresh_jobs
     order by started_at desc
     limit $1`,
    [limit],
  );
  return result.rows.map((row) => ({
    id: row.id,
    ticker: row.ticker,
    status: row.status,
    message: row.message,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
  }));
}

export async function seedDatabaseFromFiles({ dashboardPath, watchlistPath, force = false }) {
  if (!isDatabaseConfigured()) return false;
  await ensureDatabase();
  const existing = await loadDashboardSnapshot();
  if (existing?.companies && Object.keys(existing.companies).length && !force) return false;
  const [dashboard, watchlist] = await Promise.all([
    readFile(dashboardPath, "utf8").then(JSON.parse),
    readFile(watchlistPath, "utf8").then(JSON.parse),
  ]);
  await saveDashboardSnapshot(dashboard);
  await saveWatchlistItems(watchlist);
  return true;
}
