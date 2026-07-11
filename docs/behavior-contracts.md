# Dashboard Behavior Contracts

These contracts describe user-visible behavior that must survive refactors. A change that intentionally alters a contract must update this document and `scripts/check-regressions.mjs` in the same commit.

## Watchlist add control

- The Watchlist header always displays a visible `+` button.
- The button never changes into a checkmark or becomes disabled because the selected ticker is already saved.
- Clicking `+` focuses and selects the shared ticker search field so the user can add another company.
- Existing membership is communicated in search results with `Added`; it does not replace the header add control.
- Removing a ticker remains a separate action on that watchlist row, with a discoverable `Remove` label on hover or keyboard focus rather than an ambiguous icon-only target.
- Removing the currently selected ticker automatically selects the next available company so the dashboard never points at a removed watchlist item.
- Removing a ticker shows an `Undo` action that restores the ticker to the watchlist without rebuilding or refetching the company.
- Cached ticker search results distinguish opening an already saved ticker from adding a cached ticker.
- Every search suggestion row shows a star action state so users can save directly from the search dropdown without relying on the sidebar `+`.
- Uncached ticker search results clearly say `Fetch & add` and explain that building the SEC profile can take 30-90 seconds.
- While an uncached ticker is being added, the dropdown shows a progress panel and disables duplicate result clicks.
- Add failures show the provider error and a retry action without losing the typed ticker.

Acceptance check: select a ticker that is already in the watchlist, confirm `+` remains visible and enabled, click it, and confirm ticker search receives focus. Remove the selected ticker, confirm another company is selected and an `Undo` action appears, then click `Undo` and confirm the ticker returns.

## Metric history visualizations

- Every metric history keeps its exact period labels and displayed values. Charts supplement those values; they never replace them.
- Summary growth, margin, ratio, and trend histories use line charts.
- Cash flow, capital expenditure, expense, revenue, and other monetary histories use bar charts.
- Company-specific member, user, rate, ratio, margin, and percentage histories use line charts; other company-specific histories use bars.
- Positive bars are green and negative bars are coral.
- Missing or qualitative observations are omitted from chart geometry rather than converted to zero.
- Generated dashboard history includes raw `values` alongside formatted `displayValues`. Existing caches without raw values remain supported by conservative display-value parsing.

Acceptance check: confirm summary cards contain line charts, free cash flow contains positive/negative bars, and period/value rows remain visible below each chart.

## Per-ticker metric visibility

- Summary metrics, common financial indicators, and company-specific metrics each provide a `Hide` action.
- Every selected ticker shows a metric split profile with summary, common, stock-specific, hidden, and company-specific group counts.
- Every selected ticker with company-specific metrics shows a visual stock-specific dashboard using that ticker's own reported metrics.
- Stock-specific visual panels must use reported/custom metric values only; missing segment or geography data must remain unavailable rather than mocked.
- Company-specific metrics are grouped generically by metric semantics, such as users/scale, margins/ratios, financial operations, and other operating metrics.
- Company-specific metrics retain SEC concept, importance tier, trend, observation count, latest fiscal period, and group metadata so each ticker can expose a broad customized metric library without hardcoded ticker-specific UI.
- Metric grouping must be derived from metric names/descriptions and must not hardcode a solution for one ticker.
- Hidden state is stored independently for each ticker in browser local storage.
- Stable keys use `summary:`, `financial:`, and `custom:` namespaces so unrelated metrics cannot collide.
- Existing unnamespaced company-specific preferences are migrated to `custom:` keys when loaded.
- The dashboard-wide **Manage metrics** control remains visible even when every metric in a section is hidden.
- Opening **Manage metrics** lists every hidden metric for the selected ticker, and each item has a `Restore` action.
- Hiding a summary metric applies in both Annual and Quarterly modes when they share the same metric label.
- End users can customize company-specific metric display per ticker with grouping, sorting, and chart-style controls; these preferences persist without deleting metric data.
- The metric display controls can be hidden/collapsed, and that collapsed state persists without changing the selected display preferences.

Acceptance check: hide one metric from each of the summary, financial, and company-specific sections; switch tickers and confirm the other ticker is unchanged; return to the original ticker, restore all three from **Manage metrics**, and confirm their historical charts and values return.

## Forecast periods

- Quarter labels always use fiscal notation such as `FY26 Q2`; calendar month-year labels such as `Feb '26` are not allowed.
- Fiscal labels are calculated from the company's SEC-reported fiscal-year-end anchor, avoiding misleading `fy` values attached to later comparative facts.
- True three-month Q4 facts reported in a 10-K remain part of quarterly series.
- The upcoming quarter is rendered on the same Revenue/EPS axes as reported periods.
- Forecast revenue and EPS use amber styling and an `E` suffix to distinguish estimates from reported results.
- Unavailable provider estimates remain visible as `N/A`; the UI must not manufacture a bar, EPS point, or placeholder value.
- Alpha Vantage estimate ingestion supports the current unified `estimates` array filtered by `horizon`, plus the legacy annual/quarterly array schema.
- A future quarterly estimate must be at least 45 days after the latest reported period end, preventing calendar-date drift from selecting the already-reported fiscal quarter.
- Cached next-quarter guidance is reused only when its fiscal-quarter ordinal is later than the latest reported quarter; cached full-year guidance is preserved independently.
- Every committed company cache must contain at least one real guidance horizon; a ticker cannot ship with both next-quarter and full-year guidance empty.

## New ticker market prices

- Alpha Vantage remains a profile/estimate provider, but displayed market price should prefer the dated Nasdaq delayed quote when available.
- Nasdaq delayed quote is attempted for every refresh and may override Alpha Vantage's global quote for displayed price accuracy.
- The fallback value must be identified as `Nasdaq delayed quote`; it must never be presented as Alpha Vantage data or as a live exchange price.
- Displayed prices must include a quote date or explicitly say the quote date is unavailable.
- A failed fallback may remain unavailable, but the application must not manufacture a price.

## New ticker analyst estimates

- Alpha Vantage remains the primary source for revenue and EPS consensus.
- If Alpha Vantage omits a quarterly or annual estimate horizon, the refresh fills that horizon from Nasdaq analyst EPS forecasts when available.
- Nasdaq-only forecast fields must leave revenue consensus as `N/A`; the application must not derive or manufacture revenue guidance.
- Guidance must identify whether it came from Alpha Vantage, Nasdaq, or both.
- A less complete fallback estimate must not replace a valid cached estimate containing more real fields.

## Localization

- `EN` renders English labels and `中文` renders Chinese labels.

## Ticker news and social content

- News is fetched for the selected ticker and every headline links to its original Nasdaq-hosted article.
- News responses include provider, fetch timestamp, headline count, latest headline timestamp when available, and freshness status.
- The source/freshness panel displays news freshness and must label unavailable or stale news honestly.
- The X / Twitter card is ticker-scoped and always provides a live `$TICKER` search link.
- Recent posts are shown only when the server has `X_BEARER_TOKEN`; an unavailable token must produce an honest configuration message, not mock posts.
- News and social text is escaped before rendering, and provider credentials must never be returned to the browser.

## Production freshness

- Production reads dashboard data from Postgres, but it must not blindly trust an old snapshot forever.
- If the dashboard snapshot is older than the configured freshness window, the server marks it stale and starts a background refresh when SEC access is configured.
- On production startup, the server checks the saved dashboard snapshot and starts a background refresh when the saved data is missing, stale, or contains undated quotes.
- A full-dashboard refresh endpoint regenerates all tracked tickers and saves the latest payload back to Postgres.
- If a company quote has no provider date or the quote date is older than the configured quote window, the API clears the display price and labels the quote freshness problem instead of rendering a stale numeric price as current.
- If a quote is from a prior US market date, the API labels it as previous close and the header must say "Previous close as of ..." rather than presenting it as today's price.
- The source/freshness panel must show quote freshness separately from the raw quote provider/date.

## Research utilities

- Selecting a ticker updates the shareable `?ticker=` URL, and browser back/forward navigation restores the matching cached company.
- CSV export includes annual and quarterly summary history, common financial history, company-specific metrics, quarterly details, and available analyst estimates.
- Built-in fallback exports must identify their generated source as `[MOCK/FAKE]`.
- The selected ticker can refresh fundamentals from the research toolbar through `/api/refresh/:ticker`.
- A successful fundamentals refresh updates the selected company, peer comparison, market map, data freshness, and backend refresh status without a page reload.
- Recent backend refresh jobs are available through `/api/refresh/status` and appear in the source/freshness panel.
- Manual news refresh bypasses the normal client/server cache, while a 30-second minimum server cache prevents repeated upstream requests.
- News and X provider calls time out after 10 seconds so unavailable upstream services cannot leave the dashboard loading indefinitely.
- The company source panel identifies data freshness and the providers used for fundamentals, quotes, estimates, and news.

## Metric chart axes

- Annual/Quarterly reporting-period selection is a top-level metric control and must not be nested inside the Revenue & EPS card.
- The last selected Annual/Quarterly reporting period persists locally and, for signed-in users, syncs through cloud preferences.
- Every rendered metric history chart shows a labeled value range on the Y axis and fiscal-period labels on the X axis.
- Every rendered metric history chart includes plain-language captions explaining `X axis = fiscal period` and `Y axis = metric value/range`.
- The chart displays first-to-latest absolute change in the metric's own unit; percentage metrics use percentage-point change.
- Negative-to-positive series show a visible zero reference line, and bar colors distinguish negative values.
- Dense histories show evenly spaced fiscal-period ticks while retaining every exact period/value pair below the chart.
- Ratio values stored as decimals must be scaled to match their displayed percentage before charting.
- EPS transition labels such as `Loss to profit` remain visible, while the chart uses the underlying per-share change against the prior year or prior-year quarter.

## Industry research design

- The dashboard uses a neutral institutional palette with white cards, slate text, subtle borders, and minimal shadow.
- Decorative serif typography must not be used in the product shell; finance UI text uses Manrope and data values use DM Mono.
- Primary cards use compact radius and border treatments so dense metric grids remain readable.
- Controls use standard button/segmented-control styling with explicit active states and clear contrast.
- Keyboard users must see a clear `:focus-visible` outline on links, buttons, inputs, selects, and summaries.
- Search and account overlays close on Escape and outside click.
- Mobile search remains visible as a usable input rather than collapsing to an icon-only target.
- Design changes must bump the stylesheet cache key in `index.html` so Render deployments are visible immediately.

## Fundamentals freshness

- Each company stores latest annual period, annual filed date, latest quarterly period, quarterly filed date, and refresh timestamp for SEC-derived fundamentals.
- Each refresh checks SEC submissions for the latest 10-Q/10-K and marks the displayed fundamentals as latest, stale, or unknown.
- The source/freshness panel displays the latest annual filing and latest quarterly filing separately.
- The source/freshness panel displays the latest SEC filing used for freshness validation.
- Exported company data includes fundamentals freshness rows.
- Missing filing dates must be labeled unavailable rather than inferred.

## Forward P/E fallback

- Provider-supplied forward P/E is preferred when available.
- When it is unavailable, Forward P/E is calculated only when both a real market price and a positive full-fiscal-year analyst EPS consensus are available.
- The fallback is `price / fiscal-year EPS consensus` and must be labeled `[CALCULATED]`; trailing P/E must not be mislabeled as forward P/E.
- The same resolved Forward P/E feeds metric cards, peer comparison, and the valuation scatter plot.
- Newly introduced visible controls and status messages require entries in the shared translation map.

## Production persistence

- The browser loads generated dashboard data from `/api/dashboard`, not directly from the JSON cache as the only source.
- Production requires `DATABASE_URL`; it must fail loudly rather than silently serving `data/dashboard.json`.
- Local JSON fallback is development/bootstrap-only and should be removed after remaining state is migrated.
- `npm run refresh` writes Postgres in production and writes the committed JSON cache only outside production.
- Adding a ticker persists the watchlist item and refreshed dashboard snapshot to Postgres in production.
- Production refresh reads the watchlist from Postgres rather than `config/watchlist.json`.
- Postgres support remains optional only outside production.
- Startup database seeding must preserve an existing dashboard snapshot so deploys do not overwrite server-added ticker data with older committed JSON.
- The Render Blueprint declares `DATABASE_URL` from the managed database instead of exposing database credentials in client code.

## Personal accounts

- The top bar exposes a visible account control that distinguishes local browser mode from signed-in cloud mode.
- Production end-user sign-in uses Supabase Auth with Google OAuth and email magic links.
- Supabase access tokens are exchanged server-side through `/api/session/supabase` before Northstar creates its own signed session cookie.
- GitHub OAuth may remain as a secondary developer sign-in, but it must not be the only production end-user path.
- Signing in creates a signed, HttpOnly session cookie; the browser must not receive provider secrets or OAuth access tokens.
- Signed-in watchlists are stored under `user_watchlist_items` in Postgres.
- Signed-in metric visibility and display preferences are stored under `user_preferences` in Postgres.
- Unsigned users may keep a local browser fallback, but production personalization should prefer signed-in cloud sync.
- Render must expose `AUTH_SECRET`, `SUPABASE_URL`, and `SUPABASE_ANON_KEY`; `NORTHSTAR_INVITE_CODE` may be set to restrict access while the app is private.

## Custom domain

- `northstar-stock-intelligence.com` must be added to the Render web service as a custom domain.
- DNS for the apex domain must point to Render using Render's provided A/ALIAS/ANAME target.
- DNS for `www.northstar-stock-intelligence.com` must point to Render using the CNAME target Render provides.
- The public custom domain is not considered production-ready until Render shows the domain as verified and TLS certificate issuance has completed.

## Automated check

Run `npm run check`. In addition to JavaScript syntax validation, it verifies the source-level invariants above. Browser verification remains required for deliberate layout or interaction changes.
