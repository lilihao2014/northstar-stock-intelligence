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

## Forecast periods

- The upcoming quarter is rendered on the same Revenue/EPS axes as reported periods.
- Forecast revenue and EPS use amber styling and an `E` suffix to distinguish estimates from reported results.
- Unavailable provider estimates remain visible as `N/A`; the UI must not manufacture a bar, EPS point, or placeholder value.

## Localization

- `EN` renders English labels and `中文` renders Chinese labels.
- Newly introduced visible controls and status messages require entries in the shared translation map.

## Automated check

Run `npm run check`. In addition to JavaScript syntax validation, it verifies the source-level invariants above. Browser verification remains required for deliberate layout or interaction changes.
