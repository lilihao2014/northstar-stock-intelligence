import { readFile } from "node:fs/promises";
import { estimateSeries } from "./estimate-utils.mjs";

const [app, html, styles, refresh, dashboard] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("./refresh-data.mjs", import.meta.url), "utf8"),
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
requireContract(app.includes('renderMetricHistory(history, "metric-history", label, "line")'), "Summary histories must render line charts");
requireContract(/renderMetricHistory\(metric\.history, "financial-metric-history"[\s\S]*?\? "line" : "bar"\)/.test(app), "Financial histories must select line or bar charts");
requireContract(/miniChart\(metric,[\s\S]*?\? "line" : "bar", metric\.title\)/.test(app), "Company-specific histories must select line or bar charts");
requireContract(app.includes("history.displayValues[index]"), "Exact historical display values must remain visible");
requireContract(refresh.includes("values: entries.map((item) => item.value)"), "Generated histories must retain raw numeric values");
requireContract(styles.includes(".metric-mini-chart"), "Metric mini-chart styles are missing");

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
