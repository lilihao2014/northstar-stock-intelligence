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
- Alpha Vantage supplies company quotes, market capitalization, profile data, P/E, broad-market ETF proxies, and sector ETF quotes.
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

## Deploy on Render

The included `render.yaml` defines a public Node web service.

1. Push this project to a GitHub repository.
2. In Render, create a new Blueprint from that repository.
3. Enter `SEC_USER_AGENT` and `ALPHA_VANTAGE_API_KEY` when prompted.
4. Deploy and use the assigned `onrender.com` URL.

The free Render filesystem is ephemeral. Companies committed in `data/dashboard.json` remain available after redeploys; companies fetched on demand may need to be fetched again after a restart. A paid persistent disk or database is required for permanent server-side additions.

The market strip uses liquid ETF/ETN proxies rather than direct index feeds. Built-in fallback company figures are used only if generated data cannot load, and the entire fallback view is visibly labeled `[MOCK/FAKE]`. Always check the linked filing or investor-relations source before making an investment decision.
