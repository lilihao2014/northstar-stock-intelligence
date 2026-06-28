import { readFile } from "node:fs/promises";
import { estimateSeries } from "./estimate-utils.mjs";

const [app, html, styles, refresh, server, db, render, packageJson, dashboard] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("./refresh-data.mjs", import.meta.url), "utf8"),
  readFile(new URL("./server.mjs", import.meta.url), "utf8"),
  readFile(new URL("./db.mjs", import.meta.url), "utf8"),
  readFile(new URL("../render.yaml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
  readFile(new URL("../data/dashboard.json", import.meta.url), "utf8"),
]);

const failures = [];

function requireContract(condition, message) {
  if (!condition) failures.push(message);
}

const watchlistMarkup = html.match(/<button[^>]+id="add-watchlist"[^>]*>(.*?)<\/button>/s);
requireContract(Boolean(watchlistMarkup), "Watchlist add button is missing from index.html");
requireContract(watchlistMarkup?.[1].trim() === "+", "Watchlist add button must display +");
requireContract(!/\sdisabled(?:\s|=|>)/.test(watchlistMarkup?.[0] || ""), "Watchlist add button must not be disabled in markup");

const syncWatchlist = app.match(/function syncWatchlistButton\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
requireContract(syncWatchlist.includes('button.textContent = "+"'), "Watchlist sync must preserve the + label");
requireContract(syncWatchlist.includes("button.disabled = false"), "Watchlist sync must keep the add button enabled");
requireContract(!syncWatchlist.includes("✓"), "Watchlist sync must not replace + with a checkmark");

const openSearch = app.match(/function openWatchlistSearch\(\) \{([\s\S]*?)\n\}/)?.[1] || "";
requireContract(openSearch.includes("search.focus()"), "Watchlist + must focus ticker search");
requireContract(openSearch.includes("search.select()"), "Watchlist + must select the current search query");
requireContract(/#add-watchlist[\s\S]*?openWatchlistSearch\(\)/.test(app), "Watchlist + click must call openWatchlistSearch");

requireContract(app.includes("function miniChart(history, type, title)"), "Shared metric mini-chart renderer is missing");
requireContract(app.includes('renderMetricHistory(label === "EPS growth" ? epsChangeChartHistory(company, selectedPeriod, history) : history, "metric-history", label, "line")'), "Summary histories must render line charts");
requireContract(/renderMetricHistory\(metric\.history, "financial-metric-history"[\s\S]*?\? "line" : "bar"\)/.test(app), "Financial histories must select line or bar charts");
requireContract(/miniChart\(metric,[\s\S]*?\? "line" : "bar", metric\.title\)/.test(app), "Company-specific histories must select line or bar charts");
requireContract(app.includes("history.displayValues[index]"), "Exact historical display values must remain visible");
requireContract(refresh.includes("values: entries.map((item) => item.value)"), "Generated histories must retain raw numeric values");
requireContract(styles.includes(".metric-mini-chart"), "Metric mini-chart styles are missing");
requireContract(app.includes('tr("Fiscal period")'), "Metric charts must label the X axis as fiscal period");
requireContract(app.includes('class="metric-chart-axis"'), "Metric charts must render visible axis tick labels");
requireContract(app.includes('class="metric-chart-zero"'), "Metric charts must show a zero line for sign-changing histories");
requireContract(app.includes('formatMetricAxis(change, history, true)'), "Metric charts must summarize first-to-latest change");
requireContract(styles.includes(".metric-chart-grid"), "Metric chart grid styling is missing");
requireContract(app.includes('axisFormat: "eps"'), "EPS histories must retain numeric per-share changes for charting");
requireContract(app.includes('const step = period === "quarterly" ? 4 : 1'), "Quarterly EPS charts must compare against the prior-year quarter");
requireContract(refresh.includes("price / fiscalYearEstimate.epsAverage"), "Refresh must derive forward P/E from price and fiscal-year EPS consensus");
requireContract(!refresh.includes("Number(overview.PERatio)"), "Trailing P/E must not be used as forward P/E");
requireContract(app.includes('calculatedPe ? "[CALCULATED]"'), "Cached companies must label derived forward P/E as calculated");
requireContract(app.includes("realCompany.price / fiscalYearEps"), "Cached companies must derive forward P/E from real price and fiscal-year EPS consensus");
requireContract(app.includes('fetch(`/api/dashboard?ts=${Date.now()}`'), "Dashboard data must load from the backend API");
requireContract(app.includes("[404, 405].includes(apiResponse.status)"), "JSON fallback must be limited to missing backend routes");
requireContract(server.includes('url.pathname === "/api/dashboard"'), "Server must expose /api/dashboard for production data loading");
requireContract(server.includes("loadDashboardSnapshot()"), "Server must load dashboard snapshots from Postgres when configured");
requireContract(server.includes("DATABASE_URL is required in production"), "Production must fail when DATABASE_URL is missing");
requireContract(server.includes("saveDashboardSnapshot(dashboard)"), "Ticker additions must persist refreshed dashboard snapshots");
requireContract(server.includes("saveWatchlistItem"), "Ticker additions must persist watchlist items");
requireContract(refresh.includes("loadDashboardSnapshot()"), "Refresh must reuse the Postgres dashboard cache when available");
requireContract(refresh.includes("saveDashboardSnapshot(payload)"), "Refresh must persist generated dashboard snapshots to Postgres");
requireContract(refresh.includes("isProductionRuntime()") && refresh.includes("loadWatchlistItems()"), "Production refresh must read the watchlist from Postgres");
requireContract(refresh.includes("Wrote Postgres dashboard snapshot"), "Production refresh must write the Postgres dashboard snapshot");
requireContract(db.includes("create table if not exists companies"), "Postgres schema must include durable company snapshots");
requireContract(db.includes("create table if not exists watchlist_items"), "Postgres schema must include durable watchlist items");
requireContract(db.includes("create table if not exists refresh_jobs"), "Postgres schema must include refresh job tracking");
requireContract(db.includes("process.env.DATABASE_URL"), "Postgres support must be gated by DATABASE_URL");
requireContract(db.includes("process.env.NODE_ENV === \"production\""), "Production runtime detection must be centralized");
requireContract(db.includes("existing?.companies") && db.includes("!force"), "Database seeding must preserve existing dashboard snapshots unless forced");
requireContract(packageJson.includes('"db:seed"'), "Package scripts must include a database seed command");
requireContract(render.includes("fromDatabase:"), "Render Blueprint must inject DATABASE_URL from the managed database");
requireContract(render.includes("NODE_ENV") && render.includes("production"), "Render must run with production storage rules enabled");
requireContract(render.includes("npm install && npm run check"), "Render build must install runtime dependencies before checking");

requireContract(html.includes('id="manage-metrics"'), "Dashboard-wide metric manager is missing");
requireContract(html.includes('id="hidden-metrics-panel"'), "Hidden metric restore panel is missing");
requireContract(app.includes('metricKey("summary", label)'), "Summary metrics must use namespaced visibility keys");
requireContract(app.includes('metricKey("financial", metric.title)'), "Financial metrics must use namespaced visibility keys");
requireContract(app.includes('metricKey("custom", metric.id)'), "Company-specific metrics must use namespaced visibility keys");
requireContract(app.includes('id.includes(":") ? id : metricKey("custom", id)'), "Legacy hidden metric preferences must be migrated");
requireContract(app.includes("localStorage.setItem(hiddenMetricsStorageKey"), "Hidden metric preferences must persist in local storage");
requireContract(app.includes("data-restore-metric"), "Hidden metrics must provide restore actions");
requireContract(app.includes('["#metrics-grid", "#financial-metrics-grid", "#custom-metrics-grid"]'), "Every metric section must handle hide actions");
requireContract(styles.includes(".metric-visibility-card"), "Metric visibility manager styles are missing");
requireContract(html.includes('id="news-feed"'), "Ticker news section is missing");
requireContract(html.includes('id="x-feed"'), "Ticker X / Twitter section is missing");
requireContract(app.includes("renderTickerContent(company.ticker)"), "Ticker selection must refresh news and social content");
requireContract(app.includes("escapeHtml(item.title)"), "News headlines must be escaped before rendering");
requireContract(html.includes('id="copy-ticker-link"'), "Shareable ticker link action is missing");
requireContract(html.includes('id="export-company-data"'), "Company data export action is missing");
requireContract(app.includes('url.searchParams.set("ticker", ticker)'), "Ticker selection must update a shareable URL");
requireContract(app.includes('new Blob([csv], { type: "text/csv;charset=utf-8" })'), "Company CSV export is missing");
requireContract(app.includes('dataMetadata?.generatedAt || "[MOCK/FAKE]"'), "Fallback exports must retain the mock/fake label");
requireContract(server.includes("AbortSignal.timeout(10000)"), "Ticker content providers must have a bounded timeout");

const currentEstimateFixture = {
  symbol: "TEST",
  estimates: [
    { date: "2026-06-30", horizon: "fiscal quarter" },
    { date: "2026-12-31", horizon: "fiscal year" },
  ],
};
requireContract(estimateSeries(currentEstimateFixture, "fiscal quarter").length === 1, "Current Alpha Vantage quarterly estimate schema must be supported");
requireContract(estimateSeries(currentEstimateFixture, "fiscal year").length === 1, "Current Alpha Vantage annual estimate schema must be supported");
requireContract(estimateSeries({ quarterlyEarningsEstimates: [{}] }, "fiscal quarter").length === 1, "Legacy Alpha Vantage estimate schema must remain supported");
requireContract(refresh.includes("minimumSeparationDays = 45"), "Next-quarter estimates must exclude same-quarter calendar-date drift");
requireContract(refresh.includes("candidateOrdinal > latestOrdinal"), "Cached guidance must be later than the latest reported fiscal quarter");
requireContract(refresh.includes("fetchNasdaqQuote(config.ticker)"), "New ticker refresh must attempt the Nasdaq quote fallback");
requireContract(refresh.includes('quoteSource: "Nasdaq delayed quote"'), "Nasdaq fallback prices must retain their source label");
requireContract(refresh.includes("fetchNasdaqForecast(config.ticker)"), "New ticker refresh must attempt the Nasdaq forecast fallback");
requireContract(refresh.includes('estimateSource: hasAlphaEstimates'), "Mixed estimate sources must retain their provider label");
requireContract(refresh.includes('"Nasdaq analyst consensus (EPS)"'), "Nasdaq-only guidance must be labeled as EPS consensus");
requireContract(refresh.includes("estimateCompleteness(cached.guidance.nextQuarter) > estimateCompleteness(refreshed.guidance.nextQuarter)"), "A less complete forecast must not replace richer cached guidance");

requireContract(app.includes('const forecastColor = "#b9823d"'), "Forecast chart color contract is missing");
requireContract(app.includes("advanceQuarterLabel(baseData.labels.at(-1))"), "Upcoming quarter must remain on the Revenue/EPS chart");
requireContract(app.includes('revenueValue) ? estimate.revenueValue / 1e9 : null'), "Unavailable forecast revenue must remain null");
requireContract(refresh.includes('return `FY${String(fiscalYear).slice(-2)} Q${quarter}`'), "Quarter labels must use fiscal year and fiscal quarter");
requireContract(refresh.includes("const anchor = annualSeries(facts, 1).at(-1)"), "Quarter labels must derive from the fiscal-year-end anchor");
requireContract(refresh.includes('const fourthQuarter = fact.form === "10-K" && fact.fp === "FY"'), "Quarterly series must retain reported fiscal Q4 facts");
requireContract(app.includes('match(/^FY(\\d{2,4}) Q([1-4])$/)'), "Forecast labels must advance fiscal quarters");
requireContract(!/labels: \[\"Q[1-4]'/m.test(app), "Fallback dashboard must use fiscal-quarter labels");

const dashboardData = JSON.parse(dashboard);
for (const [ticker, company] of Object.entries(dashboardData.companies || {})) {
  const quarterlyLabels = company.quarterly?.labels || [];
  const customLabels = (company.customMetrics || []).flatMap((metric) => metric.labels || []);
  const allQuarterLabels = [...quarterlyLabels, ...customLabels, company.quarterDetail?.period].filter(Boolean);
  requireContract(allQuarterLabels.every((label) => /^FY\d{2} Q[1-4]$/.test(label)), `${ticker} contains a non-fiscal quarter label`);
  requireContract(new Set(quarterlyLabels).size === quarterlyLabels.length, `${ticker} contains duplicate quarterly labels`);
  const latestQuarter = quarterlyLabels.at(-1);
  const nextQuarter = company.guidance?.nextQuarter?.period;
  requireContract(Boolean(company.guidance?.nextQuarter || company.guidance?.fiscalYear), `${ticker} has no cached guidance horizon`);
  if (nextQuarter) {
    const ordinal = (label) => {
      const match = label.match(/^FY(\d{2}) Q([1-4])$/);
      return Number(match[1]) * 4 + Number(match[2]);
    };
    requireContract(ordinal(nextQuarter) > ordinal(latestQuarter), `${ticker} guidance is not later than its latest reported quarter`);
  }
}

if (failures.length) {
  console.error("Behavior contract checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Behavior contract checks passed");
}
