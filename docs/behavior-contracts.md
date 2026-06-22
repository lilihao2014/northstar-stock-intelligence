# Dashboard Behavior Contracts

These contracts describe user-visible behavior that must survive refactors. A change that intentionally alters a contract must update this document and `scripts/check-regressions.mjs` in the same commit.

## Watchlist add control

- The Watchlist header always displays a visible `+` button.
- The button never changes into a checkmark or becomes disabled because the selected ticker is already saved.
- Clicking `+` focuses and selects the shared ticker search field so the user can add another company.
- Existing membership is communicated in search results with `Added`; it does not replace the header add control.
- Removing a ticker remains a separate `x` action on that watchlist row.

Acceptance check: select a ticker that is already in the watchlist, confirm `+` remains visible and enabled, click it, and confirm ticker search receives focus.

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
- Hidden state is stored independently for each ticker in browser local storage.
- Stable keys use `summary:`, `financial:`, and `custom:` namespaces so unrelated metrics cannot collide.
- Existing unnamespaced company-specific preferences are migrated to `custom:` keys when loaded.
- The dashboard-wide **Manage metrics** control remains visible even when every metric in a section is hidden.
- Opening **Manage metrics** lists every hidden metric for the selected ticker, and each item has a `Restore` action.
- Hiding a summary metric applies in both Annual and Quarterly modes when they share the same metric label.

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

- Alpha Vantage remains the primary quote source.
- When Alpha Vantage has no quote, including during free-tier throttling, the refresh attempts Nasdaq's delayed quote feed.
- The fallback value must be identified as `Nasdaq delayed quote`; it must never be presented as Alpha Vantage data or as a live exchange price.
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
- The X / Twitter card is ticker-scoped and always provides a live `$TICKER` search link.
- Recent posts are shown only when the server has `X_BEARER_TOKEN`; an unavailable token must produce an honest configuration message, not mock posts.
- News and social text is escaped before rendering, and provider credentials must never be returned to the browser.

## Research utilities

- Selecting a ticker updates the shareable `?ticker=` URL, and browser back/forward navigation restores the matching cached company.
- CSV export includes annual and quarterly summary history, common financial history, company-specific metrics, quarterly details, and available analyst estimates.
- Built-in fallback exports must identify their generated source as `[MOCK/FAKE]`.
- Manual news refresh bypasses the normal client/server cache, while a 30-second minimum server cache prevents repeated upstream requests.
- News and X provider calls time out after 10 seconds so unavailable upstream services cannot leave the dashboard loading indefinitely.
- The company source panel identifies data freshness and the providers used for fundamentals, quotes, estimates, and news.
- Newly introduced visible controls and status messages require entries in the shared translation map.

## Automated check

Run `npm run check`. In addition to JavaScript syntax validation, it verifies the source-level invariants above. Browser verification remains required for deliberate layout or interaction changes.
