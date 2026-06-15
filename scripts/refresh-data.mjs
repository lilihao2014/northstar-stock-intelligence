import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "data", "dashboard.json");
const configuredWatchlist = JSON.parse(await readFile(path.join(root, "config", "watchlist.json"), "utf8"));
const requestedTicker = process.env.REFRESH_TICKER?.trim().toUpperCase() || null;
const watchlist = requestedTicker
  ? configuredWatchlist.filter((item) => item.ticker === requestedTicker)
  : configuredWatchlist;
const secIdentity = process.env.SEC_USER_AGENT;
const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
const marketSymbols = [
  { symbol: "SPY", name: "S&P 500 ETF" },
  { symbol: "QQQ", name: "NASDAQ 100 ETF" },
  { symbol: "DIA", name: "Dow Jones ETF" },
  { symbol: "IWM", name: "Russell 2000 ETF" },
  { symbol: "VXX", name: "Volatility ETN" },
];
const sectorSymbols = [
  { symbol: "XLK", name: "Technology", color: "#1f6657" },
  { symbol: "XLF", name: "Financials", color: "#68a590" },
  { symbol: "XLV", name: "Healthcare", color: "#cadd80" },
  { symbol: "XLY", name: "Consumer cyc.", color: "#d7a84b" },
  { symbol: "XLC", name: "Communication", color: "#e77d61" },
  { symbol: "XLI", name: "Industrials", color: "#7196ab" },
];

if (!secIdentity) {
  console.error("Missing SEC_USER_AGENT.");
  console.error('Example: SEC_USER_AGENT="Northstar lihao@example.com" npm run refresh');
  process.exit(1);
}

if (requestedTicker && !watchlist.length) {
  console.error(`Ticker ${requestedTicker} is not present in config/watchlist.json.`);
  process.exit(1);
}

const conceptCandidates = {
  revenue: [
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "SalesRevenueNet",
    "Revenues",
  ],
  eps: ["EarningsPerShareDiluted"],
  dilutedShares: ["WeightedAverageNumberOfDilutedSharesOutstanding"],
  netIncome: [
    "NetIncomeLoss",
    "ProfitLoss",
    "NetIncomeLossAvailableToCommonStockholdersBasic",
  ],
  equity: ["StockholdersEquity", "StockholdersEquityIncludingPortionAttributableToNoncontrollingInterest"],
  debt: [
    "LongTermDebtAndFinanceLeaseObligationsCurrent",
    "LongTermDebtCurrent",
    "LongTermDebtNoncurrent",
  ],
  operatingIncome: ["OperatingIncomeLoss"],
  operatingCashFlow: ["NetCashProvidedByUsedInOperatingActivities"],
  capex: ["PaymentsToAcquirePropertyPlantAndEquipment"],
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const round = (value, digits = 1) =>
  Number.isFinite(value) ? Number(value.toFixed(digits)) : null;
const percentChange = (latest, prior) => {
  if (!Number.isFinite(latest) || !Number.isFinite(prior) || prior === 0) return null;
  return ((latest - prior) / Math.abs(prior)) * 100;
};
const formatPercent = (value, digits = 1) =>
  Number.isFinite(value) ? `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%` : "N/A";
const formatMultiple = (value) => Number.isFinite(value) ? `${value.toFixed(1)}x` : "N/A";
const formatMoney = (value) => {
  if (!Number.isFinite(value)) return "N/A";
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
};

async function fetchJson(url, headers = {}) {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  return response.json();
}

function getUnitFacts(companyFacts, concepts, units) {
  const candidates = [];
  for (const concept of concepts) {
    const fact = companyFacts.facts?.["us-gaap"]?.[concept];
    if (!fact?.units) continue;
    for (const unit of units) {
      if (fact.units[unit]?.length) {
        const facts = fact.units[unit];
        const latestEnd = facts.reduce((latest, item) => item.end > latest ? item.end : latest, "");
        const annualCount = facts.filter((item) => item.form === "10-K" && item.fp === "FY").length;
        candidates.push({ facts, latestEnd, annualCount });
      }
    }
  }
  candidates.sort((a, b) =>
    b.latestEnd.localeCompare(a.latestEnd) || b.annualCount - a.annualCount,
  );
  return candidates[0]?.facts ?? [];
}

function dedupeFacts(facts) {
  const byPeriod = new Map();
  for (const fact of facts) {
    if (!fact.end || !Number.isFinite(fact.val)) continue;
    const key = `${fact.fy ?? ""}-${fact.fp ?? ""}-${fact.start ?? ""}-${fact.end}`;
    const existing = byPeriod.get(key);
    if (!existing || String(fact.filed) > String(existing.filed)) byPeriod.set(key, fact);
  }
  return [...byPeriod.values()];
}

function durationDays(fact) {
  if (!fact.start || !fact.end) return null;
  return Math.round((new Date(fact.end) - new Date(fact.start)) / 86400000);
}

function annualSeries(facts, limit = 6) {
  const candidates = dedupeFacts(facts)
    .filter((fact) => {
      const days = durationDays(fact);
      return fact.form === "10-K" && fact.fp === "FY" && days >= 300 && days <= 430;
    })
    .sort((a, b) => String(a.end).localeCompare(String(b.end)));

  const byEnd = new Map();
  for (const fact of candidates) byEnd.set(fact.end, fact);
  return [...byEnd.values()].slice(-limit);
}

function quarterlySeries(facts, limit = 6) {
  const candidates = dedupeFacts(facts)
    .filter((fact) => {
      const days = durationDays(fact);
      return fact.form === "10-Q" && ["Q1", "Q2", "Q3"].includes(fact.fp) && days >= 70 && days <= 110;
    })
    .sort((a, b) => String(a.end).localeCompare(String(b.end)));

  const byEnd = new Map();
  for (const fact of candidates) byEnd.set(fact.end, fact);
  return [...byEnd.values()].slice(-limit);
}

function latestInstant(facts) {
  return dedupeFacts(facts)
    .filter((fact) => ["10-K", "10-Q"].includes(fact.form))
    .sort((a, b) => String(b.end).localeCompare(String(a.end)))[0]?.val ?? null;
}

function labelAnnual(fact) {
  return `FY${fact.end.slice(2, 4)}`;
}

function labelQuarter(fact) {
  const month = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" })
    .format(new Date(`${fact.end}T00:00:00Z`));
  return `${month} '${fact.end.slice(2, 4)}`;
}

function closestPeriod(facts, end, toleranceDays = 8) {
  return facts.find((fact) => {
    const difference = Math.abs(new Date(fact.end) - new Date(end)) / 86400000;
    return difference <= toleranceDays;
  });
}

function alignSeries(primary, secondary, labeler, scalePrimary = 1) {
  const aligned = primary
    .map((fact) => ({ primary: fact, secondary: closestPeriod(secondary, fact.end) }))
    .filter((item) => item.secondary);

  return {
    labels: aligned.map((item) => labeler(item.primary)),
    revenue: aligned.map((item) => round(item.primary.val / scalePrimary, 1)),
    eps: aligned.map((item) => round(item.secondary.val, 2)),
  };
}

function derivePerShareSeries(netIncomeSeries, shareSeries) {
  const derived = netIncomeSeries
    .map((incomeFact) => {
      const shareFact = closestPeriod(shareSeries, incomeFact.end);
      if (!shareFact?.val) return null;
      return { ...incomeFact, val: incomeFact.val / shareFact.val, dilutedShares: shareFact.val };
    })
    .filter(Boolean);

  for (let i = 1; i < derived.length; i++) {
    const ratio = derived[i].dilutedShares / derived[i - 1].dilutedShares;
    const splitRatio = Math.round(ratio);
    if (splitRatio >= 3 && Math.abs(ratio - splitRatio) / splitRatio < 0.2) {
      for (let prior = 0; prior < i; prior++) derived[prior].val /= splitRatio;
    }
  }

  return derived;
}

function calculateCagr(values) {
  if (values.length < 2 || values[0] <= 0 || values.at(-1) <= 0) return null;
  return (Math.pow(values.at(-1) / values[0], 1 / (values.length - 1)) - 1) * 100;
}

function calculateScore({ revenueGrowth, epsGrowth, netMargin, debtToOperatingIncome }) {
  let score = 50;
  if (Number.isFinite(revenueGrowth)) score += Math.max(-10, Math.min(18, revenueGrowth * 0.8));
  if (Number.isFinite(epsGrowth)) score += Math.max(-10, Math.min(15, epsGrowth * 0.35));
  if (Number.isFinite(netMargin)) score += Math.max(-5, Math.min(15, netMargin * 0.35));
  if (Number.isFinite(debtToOperatingIncome)) score += debtToOperatingIncome < 1 ? 6 : debtToOperatingIncome < 2 ? 3 : -4;
  return Math.round(Math.max(20, Math.min(96, score)));
}

function qualityLabel(score) {
  if (score >= 90) return ["Exceptional quality", "Strong growth and profitability create an unusually resilient fundamental profile."];
  if (score >= 82) return ["Strong compounder", "Healthy growth and durable economics support long-term compounding potential."];
  if (score >= 72) return ["Solid fundamentals", "The business is performing well, with a few areas worth monitoring."];
  return ["Mixed profile", "Growth, profitability, or balance-sheet signals require closer review."];
}

async function fetchAlphaVantage(ticker) {
  if (!alphaKey) return null;
  const params = new URLSearchParams({ function: "OVERVIEW", symbol: ticker, apikey: alphaKey });
  const quoteParams = new URLSearchParams({ function: "GLOBAL_QUOTE", symbol: ticker, apikey: alphaKey });

  async function fetchEndpoint(url) {
    const payload = await fetchJson(url);
    return payload.Note || payload.Information ? null : payload;
  }

  const quoteResponse = await fetchEndpoint(`https://www.alphavantage.co/query?${quoteParams}`);
  await delay(850);
  const overview = await fetchEndpoint(`https://www.alphavantage.co/query?${params}`);
  const quote = quoteResponse?.["Global Quote"] ?? {};
  if (!quoteResponse && !overview) throw new Error("Alpha Vantage rate limit reached");
  return { overview, quote };
}

async function fetchMarketQuote(symbol) {
  if (!alphaKey) return null;
  const params = new URLSearchParams({ function: "GLOBAL_QUOTE", symbol, apikey: alphaKey });
  const response = await fetchJson(`https://www.alphavantage.co/query?${params}`);
  if (response.Note || response.Information) return null;
  const quote = response["Global Quote"] ?? {};
  const price = Number(quote["05. price"]);
  const change = Number(String(quote["10. change percent"] ?? "").replace("%", ""));
  if (!Number.isFinite(price)) return null;
  return {
    symbol,
    price,
    change: Number.isFinite(change) ? change : 0,
    tradingDay: quote["07. latest trading day"] || null,
  };
}

function buildCompany(config, companyFacts, alpha) {
  const revenueFacts = getUnitFacts(companyFacts, conceptCandidates.revenue, ["USD"]);
  const epsFacts = getUnitFacts(companyFacts, conceptCandidates.eps, ["USD/shares", "USD / shares"]);
  const dilutedShareFacts = getUnitFacts(companyFacts, conceptCandidates.dilutedShares, ["shares"]);
  const netIncomeFacts = getUnitFacts(companyFacts, conceptCandidates.netIncome, ["USD"]);
  const operatingIncomeFacts = getUnitFacts(companyFacts, conceptCandidates.operatingIncome, ["USD"]);
  const equityFacts = getUnitFacts(companyFacts, conceptCandidates.equity, ["USD"]);
  const operatingCashFlowFacts = getUnitFacts(companyFacts, conceptCandidates.operatingCashFlow, ["USD"]);
  const capexFacts = getUnitFacts(companyFacts, conceptCandidates.capex, ["USD"]);
  const debtFacts = conceptCandidates.debt.flatMap((concept) =>
    getUnitFacts(companyFacts, [concept], ["USD"]),
  );

  const revenueAnnual = annualSeries(revenueFacts);
  const rawEpsAnnual = annualSeries(epsFacts);
  const revenueQuarterly = quarterlySeries(revenueFacts);
  const netIncomeAnnual = annualSeries(netIncomeFacts);
  const netIncomeQuarterly = quarterlySeries(netIncomeFacts);
  const dilutedSharesAnnual = annualSeries(dilutedShareFacts);
  const dilutedSharesQuarterly = quarterlySeries(dilutedShareFacts);
  const epsAnnual = derivePerShareSeries(netIncomeAnnual, dilutedSharesAnnual);
  const epsQuarterly = derivePerShareSeries(netIncomeQuarterly, dilutedSharesQuarterly);
  if (epsAnnual.length < 2) epsAnnual.push(...rawEpsAnnual);
  if (epsQuarterly.length < 2) epsQuarterly.push(...quarterlySeries(epsFacts));
  const operatingIncomeAnnual = annualSeries(operatingIncomeFacts);
  const cashFlowAnnual = annualSeries(operatingCashFlowFacts);
  const capexAnnual = annualSeries(capexFacts);

  const annual = alignSeries(revenueAnnual, epsAnnual, labelAnnual, 1e9);
  const quarterly = alignSeries(revenueQuarterly, epsQuarterly, labelQuarter, 1e9);
  if (annual.labels.length < 2) throw new Error(`Insufficient annual revenue/EPS history for ${config.ticker}`);

  const latestRevenue = revenueAnnual.at(-1)?.val;
  const priorRevenue = revenueAnnual.at(-2)?.val;
  const latestEps = epsAnnual.at(-1)?.val;
  const priorEps = epsAnnual.at(-2)?.val;
  const latestNetIncome = netIncomeAnnual.at(-1)?.val;
  const priorNetIncome = netIncomeAnnual.at(-2)?.val;
  const latestOperatingIncome = operatingIncomeAnnual.at(-1)?.val;
  const revenueGrowth = percentChange(latestRevenue, priorRevenue);
  const priorRevenueGrowth = revenueAnnual.length > 2 ? percentChange(priorRevenue, revenueAnnual.at(-3)?.val) : null;
  const epsGrowth = percentChange(latestEps, priorEps);
  const priorEpsGrowth = epsAnnual.length > 2 ? percentChange(priorEps, epsAnnual.at(-3)?.val) : null;
  const netMargin = latestRevenue ? (latestNetIncome / latestRevenue) * 100 : null;
  const priorNetMargin = priorRevenue ? (priorNetIncome / priorRevenue) * 100 : null;
  const debt = latestInstant(debtFacts);
  const equity = latestInstant(equityFacts);
  const debtToOperatingIncome = latestOperatingIncome ? debt / latestOperatingIncome : null;
  const revenueCagr = calculateCagr(revenueAnnual.map((fact) => fact.val));
  const latestOperatingCashFlow = cashFlowAnnual.at(-1)?.val;
  const latestCapex = capexAnnual.at(-1)?.val;
  const freeCashFlow = Number.isFinite(latestOperatingCashFlow) && Number.isFinite(latestCapex)
    ? latestOperatingCashFlow - Math.abs(latestCapex)
    : null;

  const overview = alpha?.overview ?? {};
  const quote = alpha?.quote ?? {};
  const price = Number(quote["05. price"]) || null;
  const change = Number(String(quote["10. change percent"] ?? "").replace("%", "")) || 0;
  const marketCap = Number(overview.MarketCapitalization) || null;
  const pe = Number(overview.ForwardPE) || Number(overview.PERatio) || null;
  const fcfYield = marketCap && freeCashFlow ? (freeCashFlow / marketCap) * 100 : null;
  const roe = equity && latestNetIncome ? (latestNetIncome / equity) * 100 : null;
  const score = calculateScore({ revenueGrowth, epsGrowth, netMargin, debtToOperatingIncome });
  const [quality, copy] = qualityLabel(score);

  return {
    name: companyFacts.entityName,
    ticker: config.ticker,
    meta: `${overview.Sector || config.sector} · ${overview.Industry || config.industry} · ${overview.Exchange || config.exchange}`,
    price,
    change,
    cap: marketCap ? formatMoney(marketCap) : "Quote key required",
    score,
    quality,
    copy,
    color: config.color,
    metrics: [
      ["Revenue growth", formatPercent(revenueGrowth), formatPercent((revenueGrowth ?? 0) - (priorRevenueGrowth ?? 0), 1).replace("%", " pts"), "Latest reported fiscal year"],
      ["EPS growth", formatPercent(epsGrowth), formatPercent((epsGrowth ?? 0) - (priorEpsGrowth ?? 0), 1).replace("%", " pts"), "Diluted EPS, latest fiscal year"],
      ["Net margin", Number.isFinite(netMargin) ? `${netMargin.toFixed(1)}%` : "N/A", formatPercent((netMargin ?? 0) - (priorNetMargin ?? 0), 1).replace("%", " pts"), "Calculated from SEC filings"],
      ["Forward P/E", formatMultiple(pe), "Provider", alpha ? "Alpha Vantage overview" : "Add Alpha Vantage key"],
    ],
    signals: [
      ["FCF yield", Number.isFinite(fcfYield) ? `${fcfYield.toFixed(1)}%` : "N/A"],
      ["ROE", Number.isFinite(roe) ? `${roe.toFixed(1)}%` : "N/A"],
      ["Debt / op. income", formatMultiple(debtToOperatingIncome)],
      ["Revenue CAGR", Number.isFinite(revenueCagr) ? `${revenueCagr.toFixed(1)}%` : "N/A"],
    ],
    annual,
    quarterly: quarterly.labels.length >= 2 ? quarterly : annual,
    operating: {
      title: "Quarterly revenue",
      value: `$${quarterly.revenue.at(-1)?.toFixed(1) ?? annual.revenue.at(-1)?.toFixed(1)}B`,
      label: "latest reported quarter",
      change: quarterly.revenue.length > 1
        ? formatPercent(percentChange(quarterly.revenue.at(-1), quarterly.revenue.at(-2)))
        : formatPercent(revenueGrowth),
      values: quarterly.revenue.length >= 2 ? quarterly.revenue : annual.revenue,
      years: quarterly.labels.length >= 2 ? quarterly.labels : annual.labels,
      insight: "Reported revenue trend derived from SEC 10-Q and 10-K filings.",
      provenance: "sec-derived",
    },
    analytics: {
      revenueGrowth: round(revenueGrowth),
      epsGrowth: round(epsGrowth),
      netMargin: round(netMargin),
      pe: round(pe),
      score,
    },
    sources: {
      fundamentals: `https://data.sec.gov/api/xbrl/companyfacts/CIK${config.cik}.json`,
      quote: alpha ? "Alpha Vantage" : null,
    },
  };
}

async function refreshCompany(config, index) {
  if (index > 0) await delay(150);
  const companyFacts = await fetchJson(
    `https://data.sec.gov/api/xbrl/companyfacts/CIK${config.cik}.json`,
    {
      "User-Agent": secIdentity,
      "Accept-Encoding": "gzip, deflate",
      Host: "data.sec.gov",
    },
  );

  let alpha = null;
  if (alphaKey) {
    try {
      alpha = await fetchAlphaVantage(config.ticker);
    } catch (error) {
      console.warn(`  Quote/profile skipped: ${error.message}`);
    }
  }
  return buildCompany(config, companyFacts, alpha);
}

const previous = await readFile(outputPath, "utf8").then(JSON.parse).catch(() => null);
const companies = requestedTicker ? { ...(previous?.companies || {}) } : {};
const failures = [];

for (const [index, config] of watchlist.entries()) {
  process.stdout.write(`Refreshing ${config.ticker}... `);
  try {
    const refreshed = await refreshCompany(config, index);
    const cached = previous?.companies?.[config.ticker];
    if (!Number.isFinite(refreshed.price) && Number.isFinite(cached?.price)) {
      refreshed.price = cached.price;
      refreshed.change = cached.change;
      refreshed.cap = cached.cap;
      refreshed.analytics.pe = cached.analytics?.pe ?? null;
      refreshed.metrics[3] = cached.metrics?.[3] ?? refreshed.metrics[3];
      refreshed.signals[0] = cached.signals?.[0] ?? refreshed.signals[0];
      refreshed.sources.quote = cached.sources?.quote ?? "Alpha Vantage cached";
    }
    companies[config.ticker] = refreshed;
    console.log("done");
  } catch (error) {
    failures.push(`${config.ticker}: ${error.message}`);
    if (previous?.companies?.[config.ticker]) {
      companies[config.ticker] = previous.companies[config.ticker];
      console.log("using previous cached data");
    } else {
      console.log("failed");
    }
  }
}

if (!Object.keys(companies).length) {
  console.error("No company data could be refreshed.");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

const peers = Object.values(companies)
  .filter((company) => company.analytics)
  .map((company) => ({
    ticker: company.ticker,
    growth: company.analytics.revenueGrowth,
    eps: company.analytics.epsGrowth,
    pe: company.analytics.pe,
    margin: company.analytics.netMargin,
    score: company.analytics.score,
  }));

async function refreshQuoteGroup(definitions, cachedItems = []) {
  const cachedBySymbol = new Map(cachedItems.map((item) => [item.symbol, item]));
  const results = [];
  for (const definition of definitions) {
    await delay(850);
    let quote = null;
    try {
      quote = await fetchMarketQuote(definition.symbol);
    } catch {
      quote = null;
    }
    results.push({
      ...definition,
      ...(quote || cachedBySymbol.get(definition.symbol) || {}),
    });
  }
  return results.filter((item) => Number.isFinite(item.price));
}

const marketData = requestedTicker
  ? previous?.marketData || []
  : await refreshQuoteGroup(marketSymbols, previous?.marketData);
const sectors = requestedTicker
  ? previous?.sectors || []
  : await refreshQuoteGroup(sectorSymbols, previous?.sectors);

const payload = {
  generatedAt: new Date().toISOString(),
  sourceMode: alphaKey ? "SEC filings + Alpha Vantage quotes" : "SEC filings",
  companies,
  peers,
  marketData,
  sectors,
  failures,
};

await mkdir(path.dirname(outputPath), { recursive: true });
const tempPath = `${outputPath}.tmp`;
await writeFile(tempPath, `${JSON.stringify(payload, null, 2)}\n`);
await rename(tempPath, outputPath);

console.log(`\nWrote ${path.relative(root, outputPath)} with ${Object.keys(companies).length} companies.`);
if (!alphaKey) console.log("No ALPHA_VANTAGE_API_KEY found; market quote panels will remain unavailable.");
if (failures.length) failures.forEach((failure) => console.warn(`Warning: ${failure}`));
