# Northstar Stock Intelligence

A responsive, dependency-free stock analysis dashboard covering:

- Revenue and EPS growth
- Profitability, valuation, and quality metrics
- SEC-derived quarterly operating trends
- Peer comparisons
- Broad-market and sector ETF performance
- Growth-versus-valuation market mapping

## Refresh real data

Northstar uses a local refresh script instead of a backend server:

- SEC Company Facts supplies reported revenue, EPS, margins, cash flow, debt, and equity.
- Alpha Vantage supplies company quotes, market capitalization, profile data, P/E, analyst estimates, broad-market ETF proxies, and sector ETF quotes.
- Northstar calculates a clearly labeled fundamental score from reported growth, profitability, and balance-sheet metrics.

Set your SEC identity. The SEC requires an application name and contact email in the user agent:

```bash
export SEC_USER_AGENT="Northstar your-email@example.com"
npm run refresh
```

This writes normalized data to `data/dashboard.json`. The dashboard loads that file automatically and falls back to its built-in demo data if it is unavailable.

For quote and valuation data, create an Alpha Vantage key and create a local `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```dotenv
SEC_USER_AGENT="Northstar your-email@example.com"
ALPHA_VANTAGE_API_KEY="your-key"
```

Then regenerate the cache:

```bash
npm run refresh
```

API keys stay in your terminal environment and are never sent to the browser.

To change the companies being tracked, edit `config/watchlist.json`.

Ticker-specific operating metrics are controlled by `config/company-metrics.json`. By default, the refresh process discovers useful company-extension concepts from recent SEC inline XBRL filings, ranks recurring operating metrics above accounting details, and keeps up to the configured `maxMetrics`. Explicit ticker entries map important concepts, units, and display formats so metrics such as OSCR quarterly members are always retained. The dashboard renders only metrics actually reported for the selected company; it does not apply OSCR metrics to AAPL or manufacture a common KPI set.

Users can hide discovered company-specific metrics independently for each ticker. These preferences are stored in browser local storage; the source metric remains in the generated catalog and can be restored later from **Manage metrics**.

Common financial indicators are calculated consistently for every ticker from standardized SEC facts. These include free cash flow, operating cash flow, capital expenditures, FCF margin, operating margin, return on equity, leverage, and revenue CAGR. A value remains `N/A` when the required facts are not reported rather than being estimated or replaced with mock data.

Historical observations are retained and displayed alongside the latest value for SEC-derived summary, financial, and company-specific metrics. The Annual/Quarterly selector changes both the revenue/EPS chart and the corresponding historical growth and margin series. Provider-only point-in-time metrics such as forward P/E remain current-only when no historical feed is available.

All quarterly periods use fiscal labels such as `FY26 Q2`, calculated from each company's SEC-reported fiscal-year-end anchor. Calendar month-year labels are not used for quarterly results or forecasts.

Metric histories include compact visualizations as well as exact period values: trend and ratio metrics use line charts, while cash flow, expenditure, and other monetary series use positive/negative bar charts. The Watchlist header keeps a permanent `+` control that focuses ticker search for adding another company.

User-visible invariants and their acceptance checks are maintained in [`docs/behavior-contracts.md`](docs/behavior-contracts.md). `npm run check` enforces the source-level contracts for the Watchlist add control, historical metric charts, exact-value retention, and forecast styling.

Summary, common financial, and company-specific metrics can be hidden independently for each ticker. The dashboard-wide **Manage metrics** panel lists hidden metrics and restores them later without deleting their source data or history.

The forward-outlook section shows Alpha Vantage analyst-consensus revenue and EPS estimates for the next quarter and full fiscal year, including ranges and analyst counts when supplied. The quarterly chart adds the upcoming fiscal quarter with a dashed estimate style. These values are explicitly labeled as analyst estimates rather than company-issued guidance; when the provider has no estimate or its API quota is unavailable, the expected period remains visible as `N/A` and the dashboard does not create placeholder values.

## Run locally

```bash
npm run serve
```

Then open `http://localhost:4173`.

The Node server provides:

- Full SEC-listed ticker search through `/api/tickers`
- On-demand company downloads through `/api/companies/:ticker`
- Static dashboard files and the generated data cache

Selecting an uncached ticker in search downloads its SEC fundamentals, adds it to `config/watchlist.json`, refreshes the shared cache, and opens it in the dashboard. No API key is exposed to the browser.
On-demand additions refresh only the requested ticker, preserving existing companies and market data while staying within provider request limits.

Each selected ticker also loads recent Nasdaq company news through the server. The X / Twitter card always links to the ticker's live cashtag search. To render recent X posts inside the dashboard, set `X_BEARER_TOKEN` in `.env` locally and in the Render service environment; the token is used only by the server and is never sent to the browser.

## Production persistence

Northstar can run from committed JSON files, but production deployments should set `DATABASE_URL` and use Postgres. When a database is configured:

- `/api/dashboard` loads the dashboard snapshot from Postgres first, then falls back to `data/dashboard.json`.
- `npm run refresh` writes both `data/dashboard.json` and the Postgres dashboard snapshot.
- Adding a ticker through `/api/companies/:ticker` stores the watchlist item, refreshed company snapshot, refresh job status, and full dashboard snapshot in Postgres.
- Browser-only metric visibility preferences remain local for now; the `metric_preferences` table is reserved for moving those preferences server-side with user accounts.

To initialize a local or Render database from the committed cache:

```bash
npm run db:seed
```

If `DATABASE_URL` is not set, the seed command exits without changing anything and the app continues in JSON fallback mode. If the database already has a dashboard snapshot, seeding preserves it; use `npm run db:seed -- --force` only when you intentionally want to replace the database snapshot with committed JSON.

## Deploy on Render

The included `render.yaml` defines a public Node web service.

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint from that repository.
3. Enter `SEC_USER_AGENT`, `ALPHA_VANTAGE_API_KEY`, and optional `X_BEARER_TOKEN` when prompted.
4. Deploy and use the assigned `onrender.com` URL.

The Blueprint also declares a Postgres database and injects `DATABASE_URL` into the service. Companies committed in `data/dashboard.json` remain available as a fallback, while companies fetched on demand are durable once Postgres is connected.

For an always-on public site, use a paid Render web-service instance. Free web services may sleep when idle.

The market strip uses liquid ETF/ETN proxies rather than direct index feeds. Built-in fallback company figures are used only if generated data cannot load, and the entire fallback view is visibly labeled `[MOCK/FAKE]`. Always check the linked filing or investor-relations source before making an investment decision.
