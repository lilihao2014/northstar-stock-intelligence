import { readFile } from "node:fs/promises";

const [app, html, styles, refresh] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("./refresh-data.mjs", import.meta.url), "utf8"),
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

requireContract(app.includes('const forecastColor = "#b9823d"'), "Forecast chart color contract is missing");
requireContract(app.includes("advanceQuarterLabel(baseData.labels.at(-1))"), "Upcoming quarter must remain on the Revenue/EPS chart");
requireContract(app.includes('revenueValue) ? estimate.revenueValue / 1e9 : null'), "Unavailable forecast revenue must remain null");

if (failures.length) {
  console.error("Behavior contract checks failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Behavior contract checks passed");
}
