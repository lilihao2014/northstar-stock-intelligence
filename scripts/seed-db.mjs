import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureDatabase, isDatabaseConfigured, seedDatabaseFromFiles } from "./db.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

if (!isDatabaseConfigured()) {
  console.log("DATABASE_URL is not configured; skipping database seed.");
  process.exit(0);
}

await ensureDatabase();
const seeded = await seedDatabaseFromFiles({
  dashboardPath: path.join(root, "data", "dashboard.json"),
  watchlistPath: path.join(root, "config", "watchlist.json"),
  force: process.argv.includes("--force"),
});

console.log(seeded
  ? "Postgres schema is ready and seeded from committed dashboard data."
  : "Postgres schema is ready; existing dashboard snapshot was preserved.");
