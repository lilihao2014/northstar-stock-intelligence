import { readFile } from "node:fs/promises";
import { estimateSeries } from "./estimate-utils.mjs";

const [app, html, styles, refresh, server, db, ensureDeps, render, packageJson, dashboard, quoteTests] = await Promise.all([
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("./refresh-data.mjs", import.meta.url), "utf8"),
  readFile(new URL("./server.mjs", import.meta.url), "utf8"),
  readFile(new URL("./db.mjs", import.meta.url), "utf8"),
  readFile(new URL("./ensure-deps.mjs", import.meta.url), "utf8"),
  readFile(new URL("../render.yaml", import.meta.url), "utf8"),
  readFile(new URL("../package.json", import.meta.url), "utf8"),
  readFile(new URL("../data/dashboard.json", import.meta.url), "utf8"),
  readFile(new URL("../tests/quote-freshness.test.mjs", import.meta.url), "utf8"),
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
requireContract(app.includes("pendingTickerFetch"), "Add ticker flow must track the active ticker fetch");
requireContract(app.includes("Fetch & add") && app.includes("Usually takes 30-90 seconds for a new ticker."), "Uncached ticker results must explain the fetch-and-add workflow");
requireContract(app.includes("function searchStar(company)") && app.includes("★") && app.includes("☆"), "Search suggestions must show star save states");
requireContract(app.includes("search-progress") && app.includes("Keep this tab open while Northstar builds the profile."), "Add ticker flow must show progress while building a new SEC profile");
requireContract(app.includes("data-retry-ticker") && app.includes("Add ticker failed"), "Add ticker failures must expose a retry action");
requireContract(app.includes("Already saved") && app.includes("Add cached"), "Cached ticker results must distinguish saved and unsaved states");
requireContract(styles.includes(".search-progress") && styles.includes(".search-retry") && styles.includes(".search-result.loading") && styles.includes(".search-result-action.saved"), "Add ticker search UX styles are missing");
requireContract(app.includes('tr("Remove")') && app.includes("function showWatchlistUndo(") && app.includes("function restoreRemovedTicker("), "Watchlist removal must be labeled and reversible");
requireContract(app.includes("lastRemovedTicker") && app.includes("selectedTicker === ticker"), "Removing a selected ticker must track undo state and choose a new selection");
requireContract(styles.includes(".watchlist-remove em") && styles.includes(".watchlist-undo"), "Watchlist remove/undo styles are missing");

requireContract(app.includes("function miniChart(history, type, title)"), "Shared metric mini-chart renderer is missing");
requireContract(app.includes('renderMetricHistory(label === "EPS growth" ? epsChangeChartHistory(company, selectedPeriod, history) : history, "metric-history", label, "line")'), "Summary histories must render line charts");
requireContract(/renderMetricHistory\(metric\.history, "financial-metric-history"[\s\S]*?\? "line" : "bar"\)/.test(app), "Financial histories must select line or bar charts");
requireContract(app.includes("miniChart(metric, metricChartType(metric, settings), metric.title)"), "Company-specific histories must select line or bar charts through display settings");
requireContract(app.includes("history.displayValues[index]"), "Exact historical display values must remain visible");
requireContract(refresh.includes("values: entries.map((item) => item.value)"), "Generated histories must retain raw numeric values");
requireContract(styles.includes(".metric-mini-chart"), "Metric mini-chart styles are missing");
requireContract(app.includes('tr("Fiscal period")'), "Metric charts must label the X axis as fiscal period");
requireContract(app.includes('class="metric-chart-axis"'), "Metric charts must render visible axis tick labels");
requireContract(app.includes('class="metric-axis-explainer"') && app.includes('tr("X axis")') && app.includes('tr("Y axis")'), "Metric charts must explain X and Y axes in plain language");
requireContract(app.includes('class="metric-chart-zero"'), "Metric charts must show a zero line for sign-changing histories");
requireContract(app.includes('formatMetricAxis(change, history, true)'), "Metric charts must summarize first-to-latest change");
requireContract(styles.includes(".metric-chart-grid"), "Metric chart grid styling is missing");
requireContract(styles.includes(".metric-axis-explainer"), "Metric axis explanation styling is missing");
requireContract(app.includes('axisFormat: "eps"'), "EPS histories must retain numeric per-share changes for charting");
requireContract(app.includes('const step = period === "quarterly" ? 4 : 1'), "Quarterly EPS charts must compare against the prior-year quarter");
requireContract(!html.includes("Playfair") && !styles.includes("Playfair"), "Product shell must not use decorative serif typography");
requireContract(html.includes("styles.css?v=20260711-watchlist-1"), "Stylesheet cache key must be bumped for the latest interaction refresh");
requireContract(styles.includes("--cream: #f5f7fa") && styles.includes("--card: #ffffff") && styles.includes("--line: #d8dee6"), "Industry design palette tokens are missing");
requireContract(styles.includes("--shadow: 0 1px 2px rgba(15, 23, 42, 0.06)"), "Card shadow must remain subtle for the research-dashboard design");
requireContract(styles.includes("border-radius: var(--radius)") && styles.includes("--radius: 8px"), "Cards must use compact industry-dashboard radius");
requireContract(styles.includes(".company-price strong") && styles.includes('font: 600 22px "DM Mono"'), "Market price typography must remain compact and data-oriented");
requireContract(styles.includes(":focus-visible") && styles.includes("outline: 2px solid var(--blue)"), "Interactive controls must expose a visible keyboard focus state");
requireContract(app.includes("function closeAccountPanel()") && app.includes('event.key === "Escape"') && app.includes('!event.target.closest(".account-control")'), "Search and account overlays must close on Escape and outside click");
requireContract(!styles.includes(".search-box input,\n  .search-box kbd {\n    display: none;"), "Mobile search must not collapse into an icon-only control");
requireContract(refresh.includes("price / fiscalYearEstimate.epsAverage"), "Refresh must derive forward P/E from price and fiscal-year EPS consensus");
requireContract(!refresh.includes("Number(overview.PERatio)"), "Trailing P/E must not be used as forward P/E");
requireContract(app.includes('calculatedPe ? "[CALCULATED]"'), "Cached companies must label derived forward P/E as calculated");
requireContract(app.includes("realCompany.price / fiscalYearEps"), "Cached companies must derive forward P/E from real price and fiscal-year EPS consensus");
requireContract(app.includes('fetch(`/api/dashboard?ts=${Date.now()}`'), "Dashboard data must load from the backend API");
requireContract(app.includes("[404, 405].includes(apiResponse.status)"), "JSON fallback must be limited to missing backend routes");
requireContract(server.includes('url.pathname === "/api/dashboard"'), "Server must expose /api/dashboard for production data loading");
requireContract(server.includes("loadDashboardSnapshot()"), "Server must load dashboard snapshots from Postgres when configured");
requireContract(server.includes("DATABASE_URL is required in production"), "Production must fail when DATABASE_URL is missing");
requireContract(server.includes("function prepareDashboardForRead("), "Production dashboard reads must apply freshness checks");
requireContract(server.includes("function quoteFreshness("), "Server must validate quote dates before display");
requireContract(server.includes("displayable: false"), "Undated or stale quotes must not be displayable as current prices");
requireContract(server.includes("replace(/\\sET$/i") || server.includes("replace(/\\\\sET$/i"), "Quote freshness parser must handle provider timestamps ending in ET");
requireContract(quoteTests.includes("Jun 30, 2026 5:55 PM ET") && quoteTests.includes("prepareDashboardForRead"), "Quote freshness tests must cover ET timestamps and dashboard sanitization");
requireContract(server.includes("marketDateKey(") && server.includes('"previous-close"'), "Prior-day quotes must be labeled as previous close, not current");
requireContract(server.includes("scheduleDashboardRefresh(\"stale dashboard or undated quotes\")"), "Stale production dashboards must trigger background refresh");
requireContract(server.includes("refreshStaleDashboardOnStartup()"), "Production startup must check whether saved dashboard data needs refresh");
requireContract(server.includes('url.pathname === "/api/refresh"'), "Server must expose a full dashboard refresh endpoint");
requireContract(server.includes("await runRefresh();") && server.includes('createRefreshJob("ALL")'), "Full refresh endpoint must regenerate and persist the dashboard snapshot");
requireContract(server.includes("saveDashboardSnapshot(dashboard)"), "Ticker additions must persist refreshed dashboard snapshots");
requireContract(server.includes("saveWatchlistItem"), "Ticker additions must persist watchlist items");
requireContract(refresh.includes("loadDashboardSnapshot()"), "Refresh must reuse the Postgres dashboard cache when available");
requireContract(refresh.includes("saveDashboardSnapshot(payload)"), "Refresh must persist generated dashboard snapshots to Postgres");
requireContract(refresh.includes("isProductionRuntime()") && refresh.includes("loadWatchlistItems()"), "Production refresh must read the watchlist from Postgres");
requireContract(refresh.includes("Wrote Postgres dashboard snapshot"), "Production refresh must write the Postgres dashboard snapshot");
requireContract(db.includes("create table if not exists companies"), "Postgres schema must include durable company snapshots");
requireContract(db.includes("create table if not exists watchlist_items"), "Postgres schema must include durable watchlist items");
requireContract(db.includes("create table if not exists users"), "Postgres schema must include users");
requireContract(db.includes("create table if not exists user_watchlist_items"), "Postgres schema must include per-user watchlists");
requireContract(db.includes("create table if not exists user_preferences"), "Postgres schema must include per-user preferences");
requireContract(db.includes("create table if not exists refresh_jobs"), "Postgres schema must include refresh job tracking");
requireContract(db.includes("process.env.DATABASE_URL"), "Postgres support must be gated by DATABASE_URL");
requireContract(db.includes("process.env.NODE_ENV === \"production\""), "Production runtime detection must be centralized");
requireContract(db.includes("upsertUser") && db.includes("saveUserWatchlistItems") && db.includes("saveUserPreference"), "User-scoped persistence helpers are missing");
requireContract(db.includes("existing?.companies") && db.includes("!force"), "Database seeding must preserve existing dashboard snapshots unless forced");
requireContract(packageJson.includes('"db:seed"'), "Package scripts must include a database seed command");
requireContract(packageJson.includes('"test"') && packageJson.includes("node --test"), "Package scripts must include executable tests");
requireContract(packageJson.includes("npm run test"), "Check script must run the test suite");
requireContract(packageJson.includes("scripts/ensure-deps.mjs"), "Check script must bootstrap runtime dependencies for Render");
requireContract(ensureDeps.includes('await import("pg")') && ensureDeps.includes("npm"), "Dependency bootstrap must install pg when missing");
requireContract(render.includes("fromDatabase:"), "Render Blueprint must inject DATABASE_URL from the managed database");
requireContract(render.includes("NODE_ENV") && render.includes("production"), "Render must run with production storage rules enabled");
requireContract(render.includes("AUTH_SECRET") && render.includes("SUPABASE_URL") && render.includes("SUPABASE_ANON_KEY") && render.includes("NORTHSTAR_INVITE_CODE"), "Render must reserve production end-user auth environment variables");
requireContract(render.includes("npm install && npm run check"), "Render build must install runtime dependencies before checking");

requireContract(server.includes('url.pathname === "/api/session"'), "Server must expose session endpoints");
requireContract(server.includes('url.pathname === "/auth/supabase/google/start"'), "Server must expose Supabase Google OAuth start route");
requireContract(server.includes('url.pathname === "/api/session/supabase"'), "Server must exchange Supabase access tokens for Northstar sessions");
requireContract(server.includes('url.pathname === "/api/auth/supabase/magic-link"'), "Server must expose Supabase email magic-link endpoint");
requireContract(server.includes("fetchSupabaseUser") && server.includes("/auth/v1/user") && server.includes("SUPABASE_ANON_KEY"), "Server must verify Supabase users before creating sessions");
requireContract(server.includes("sendSupabaseMagicLink") && server.includes("/auth/v1/otp"), "Server must request Supabase magic links through the Auth API");
requireContract(server.includes('url.pathname === "/auth/github/start"') && server.includes('url.pathname === "/auth/github/callback"'), "Server must expose GitHub OAuth routes");
requireContract(server.includes("https://github.com/login/oauth/authorize") && server.includes("https://github.com/login/oauth/access_token"), "GitHub OAuth authorization and token exchange are missing");
requireContract(server.includes("northstar_oauth_state") && server.includes("randomBytes(24)") && server.includes("scope: \"read:user user:email\""), "GitHub OAuth must use state validation and verified email scope");
requireContract(server.includes("Authorization: `Bearer ${tokenPayload.access_token}`") && server.includes("https://api.github.com/user/emails"), "Server must fetch GitHub identity without exposing access tokens to the browser");
requireContract(server.includes("HttpOnly") && server.includes("SameSite=Lax"), "Session cookie must be HttpOnly with SameSite protection");
requireContract(server.includes("createHmac") && server.includes("timingSafeEqual"), "Session cookie must be signed and verified safely");
requireContract(server.includes('url.pathname === "/api/me/watchlist"'), "Server must expose per-user watchlist endpoints");
requireContract(server.includes('url.pathname === "/api/me/preferences"'), "Server must expose per-user preference endpoints");
requireContract(html.includes('id="account-control"') && html.includes('id="google-signin"') && html.includes('href="/auth/supabase/google/start"'), "End-user Google sign-in UI is missing");
requireContract(html.includes('id="signin-form"') && app.includes("Magic link sent. Check your email."), "Email magic-link sign-in UI is missing");
requireContract(app.includes("currentUser") && app.includes("supabaseAuthConfigured") && app.includes("completeSupabaseAuthFromHash") && app.includes("loadCloudWatchlist") && app.includes("loadCloudPersonalization"), "Client must load signed-in personalization from Supabase-backed sessions");
requireContract(app.includes("/api/me/watchlist") && app.includes("/api/me/preferences"), "Client must sync user watchlist and preferences to server endpoints");
requireContract(app.includes("Cloud sync enabled") && app.includes("Local browser mode") && app.includes("Continue with Google"), "Client must distinguish signed-in cloud mode from local mode");
requireContract(styles.includes(".account-panel") && styles.includes(".oauth-button") && styles.includes(".oauth-secondary") && styles.includes("backdrop-filter"), "Interactive account panel styling is missing");
requireContract(app.includes('const selectedPeriodStorageKey = "northstar-selected-period"') && app.includes("localStorage.setItem(selectedPeriodStorageKey, selectedPeriod)") && app.includes("syncPeriodControl()"), "Annual/Quarterly selection must persist locally and update the segmented control");
requireContract(app.includes("validReportingPeriod(payload.selectedPeriod)") && server.includes("selectedPeriod: await loadUserPreference") && server.includes('saveUserPreference(session.userKey, "selectedPeriod"'), "Annual/Quarterly selection must sync through signed-in preferences");

requireContract(html.includes('id="manage-metrics"'), "Dashboard-wide metric manager is missing");
requireContract(/metric-visibility-card[\s\S]*id="period-control"/.test(html), "Annual/Quarterly control must live in the top-level metric controls");
requireContract(!/revenue-card[\s\S]*id="period-control"/.test(html), "Annual/Quarterly control must not be nested inside Revenue & EPS");
requireContract(html.includes('id="metric-profile"'), "Per-stock metric split profile is missing");
requireContract(html.includes('id="stock-metric-board"'), "Stock-specific visual metric dashboard is missing");
requireContract(html.includes('id="hidden-metrics-panel"'), "Hidden metric restore panel is missing");
requireContract(html.includes('id="metric-group-mode"') && html.includes('id="metric-sort-mode"') && html.includes('id="metric-chart-mode"'), "Metric display customization controls are missing");
requireContract(html.includes('id="toggle-metric-display"') && html.includes('aria-controls="metric-display-controls"'), "Metric display controls must be hideable");
requireContract(app.includes("function customMetricGroup(metric)"), "Metric grouping must be generic and client-side visible");
requireContract(app.includes("function metricProfileFor(company)"), "Metric profile derivation is missing");
requireContract(app.includes("renderMetricProfile(company)"), "Selected ticker must render its metric split profile");
requireContract(app.includes("function renderStockMetricBoard(metrics)"), "Stock-specific visual dashboard renderer is missing");
requireContract(app.includes("No stock-specific SEC metrics are available for this ticker yet."), "Missing stock-specific metrics must be shown honestly");
requireContract(app.includes("custom-metric-group"), "Company-specific metrics must render split groups");
requireContract(app.includes("custom-metric-meta") && app.includes("SEC concept"), "Company-specific metrics must show tier/trend/source detail");
requireContract(styles.includes(".metric-profile-chip"), "Metric profile chip styles are missing");
requireContract(styles.includes(".stock-metric-panel"), "Stock-specific visual dashboard styles are missing");
requireContract(styles.includes(".custom-metric-group-heading"), "Grouped custom metric styles are missing");
requireContract(styles.includes(".custom-metric-meta"), "Detailed company-specific metric metadata styles are missing");
requireContract(refresh.includes("function metricProfile("), "Generated company data must include metric profile support");
requireContract(refresh.includes("metricProfile: metricProfile("), "Refresh output must store each company's metric profile");
requireContract(refresh.includes("function metricTier(") && refresh.includes("customTiers"), "Refresh output must classify company-specific metrics by importance tier");
requireContract(refresh.includes("observationCount") && refresh.includes("trend: metricTrend"), "Generated custom metrics must retain detailed history metadata");
requireContract(refresh.includes("concept.replace(/[:]/g"), "Discovered custom metric IDs must preserve namespace to avoid collisions");
requireContract(app.includes('metricKey("summary", label)'), "Summary metrics must use namespaced visibility keys");
requireContract(app.includes('metricKey("financial", metric.title)'), "Financial metrics must use namespaced visibility keys");
requireContract(app.includes('metricKey("custom", metric.id)'), "Company-specific metrics must use namespaced visibility keys");
requireContract(app.includes('id.includes(":") ? id : metricKey("custom", id)'), "Legacy hidden metric preferences must be migrated");
requireContract(app.includes("localStorage.setItem(hiddenMetricsStorageKey"), "Hidden metric preferences must persist in local storage");
requireContract(app.includes("metricDisplayStorageKey") && app.includes("setMetricDisplaySetting"), "Metric display preferences must persist per ticker");
requireContract(app.includes("metricDisplayControlsHiddenKey") && app.includes("toggleMetricDisplayPanel"), "Metric display control collapsed state must persist");
requireContract(app.includes("metricGroupLabel(metric, settings.groupMode)") && app.includes("sortedMetrics(visibleMetrics, settings.sortMode)"), "Custom metrics must respect grouping and sorting preferences");
requireContract(app.includes("metricChartType(metric, settings)"), "Custom metric charts must respect chart display preferences");
requireContract(app.includes("data-restore-metric"), "Hidden metrics must provide restore actions");
requireContract(app.includes('["#metrics-grid", "#financial-metrics-grid", "#custom-metrics-grid"]'), "Every metric section must handle hide actions");
requireContract(styles.includes(".metric-visibility-card"), "Metric visibility manager styles are missing");
requireContract(styles.includes(".metric-display-controls"), "Metric display customization styles are missing");
requireContract(html.includes('id="news-feed"'), "Ticker news section is missing");
requireContract(html.includes('id="x-feed"'), "Ticker X / Twitter section is missing");
requireContract(app.includes("renderTickerContent(company.ticker)"), "Ticker selection must refresh news and social content");
requireContract(app.includes("escapeHtml(item.title)"), "News headlines must be escaped before rendering");
requireContract(server.includes("function newsFreshness("), "Ticker news API must include freshness metadata");
requireContract(server.includes("latestPublishedAt") && server.includes("headlineCount"), "Ticker news freshness must include latest headline and count");
requireContract(app.includes("contentMetadataByTicker"), "Client must retain ticker content freshness metadata");
requireContract(app.includes("News latest check") && app.includes("News fetched"), "Source panel must show news freshness");
requireContract(app.includes("Quote freshness") && app.includes("quoteFreshness?.label"), "Source panel must show quote freshness");
requireContract(app.includes("Previous close as of") && app.includes('quoteFreshness?.status === "previous-close"'), "Header must label prior-day quotes as previous close");
requireContract(html.includes('id="copy-ticker-link"'), "Shareable ticker link action is missing");
requireContract(html.includes('id="export-company-data"'), "Company data export action is missing");
requireContract(html.includes('id="refresh-company-data"'), "Fundamentals refresh action is missing");
requireContract(app.includes('url.searchParams.set("ticker", ticker)'), "Ticker selection must update a shareable URL");
requireContract(app.includes('new Blob([csv], { type: "text/csv;charset=utf-8" })'), "Company CSV export is missing");
requireContract(app.includes('dataMetadata?.generatedAt || "[MOCK/FAKE]"'), "Fallback exports must retain the mock/fake label");
requireContract(app.includes("refreshCompanyData(selectedTicker)"), "Fundamentals refresh action must call the backend refresh workflow");
requireContract(app.includes("/api/refresh/status"), "Refresh status must be loaded from the backend");
requireContract(app.includes("/api/refresh/${encodeURIComponent(ticker)}"), "Ticker fundamentals refresh must call the backend endpoint");
requireContract(app.includes("Last backend refresh"), "Source panel must show backend refresh status");
requireContract(server.includes('url.pathname === "/api/refresh/status"'), "Server must expose refresh job status");
requireContract(server.includes("/^\\/api\\/refresh\\/([A-Z0-9.-]+)$/i"), "Server must expose ticker refresh endpoint");
requireContract(server.includes("refreshExistingCompany(ticker)"), "Ticker refresh endpoint must refresh existing companies");
requireContract(db.includes("listRefreshJobs"), "Database module must expose refresh job history");
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
requireContract(refresh.includes('quoteSource: quote.source || "Nasdaq delayed quote"'), "Nasdaq fallback prices must retain their source label");
requireContract(refresh.includes("const quoteAsOf = quote[\"07. latest trading day\"]"), "Company quote date must be retained from the quote provider");
requireContract(refresh.includes("alpha = { ...(alpha || {}), quote, quoteSource"), "Nasdaq delayed quote must be able to correct provider quote prices");
requireContract(refresh.includes("fundamentalsAsOf") && refresh.includes("annualFiled") && refresh.includes("quarterFiled"), "Generated companies must retain fundamentals filing freshness");
requireContract(refresh.includes("fetchLatestSecFiling") && refresh.includes("fundamentalsLatestStatus"), "Refresh must verify fundamentals against latest SEC 10-Q/10-K submissions");
requireContract(refresh.includes('status: isLatest ? "latest" : "stale"'), "Fundamentals freshness must explicitly mark stale data");
requireContract(app.includes("Quote as of") && app.includes("Quote date unavailable"), "UI must display quote freshness beside prices");
requireContract(app.includes("company.sources?.quoteAsOf || company.quoteAsOf"), "UI must read quote date from company source metadata");
requireContract(app.includes("Latest annual filing") && app.includes("Latest quarterly filing"), "UI must display annual and quarterly filing freshness");
requireContract(app.includes("SEC latest check") && app.includes("Latest SEC filing"), "UI must display latest SEC filing validation");
requireContract(app.includes("Fundamentals refresh"), "UI must display fundamentals refresh timestamp");
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
