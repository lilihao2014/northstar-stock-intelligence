import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "data", "dashboard.json");
const configuredWatchlist = JSON.parse(await readFile(path.join(root, "config", "watchlist.json"), "utf8"));
const companyMetricConfig = JSON.parse(
  await readFile(path.join(root, "config", "company-metrics.json"), "utf8").catch(() => "{}"),
);
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
  premiumsEarned: ["PremiumsEarnedNet"],
  claimsIncurred: ["PolicyholderBenefitsAndClaimsIncurredNet"],
  sellingGeneralAdministrative: ["SellingGeneralAndAdministrativeExpense"],
  operatingCashFlow: ["NetCashProvidedByUsedInOperatingActivities"],
  capex: [
    "PaymentsToAcquireProductiveAssets",
    "PaymentsToAcquirePropertyPlantAndEquipment",
  ],
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
const formatPerShareChange = (value) =>
  Number.isFinite(value) ? `${value >= 0 ? "+" : "-"}$${Math.abs(value).toFixed(2)}` : "N/A";
const formatMoney = (value) => {
  if (!Number.isFinite(value)) return "N/A";
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
};
const formatCustomMetric = (value, format) => {
  if (!Number.isFinite(value)) return "N/A";
  if (format === "millions") {
    return `${(value / 1e6).toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  }
  if (format === "thousands") return `${(value / 1e3).toFixed(1)}K`;
  if (format === "percent") return `${value.toFixed(1)}%`;
  if (format === "money") return formatMoney(value);
  if (format === "ratio") return `${(value * 100).toFixed(1)}%`;
  if (format === "number") return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return value.toLocaleString("en-US");
};

function describeEpsChange(latest, prior, defaultDelta, defaultNote) {
  if (!Number.isFinite(latest) || !Number.isFinite(prior)) return ["N/A", "N/A", defaultNote];
  const change = formatPerShareChange(latest - prior);
  if (prior >= 0 && latest < 0) return ["Profit to loss", change, "EPS changed from positive to negative"];
  if (prior < 0 && latest >= 0) return ["Loss to profit", change, "EPS changed from negative to positive"];
  if (prior < 0 && latest < 0) {
    return [latest > prior ? "Loss narrowed" : "Loss widened", change, "EPS remains negative"];
  }
  return [formatPercent(percentChange(latest, prior)), defaultDelta, defaultNote];
}

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

function priorYearPeriod(facts, fact, toleranceDays = 12) {
  if (!fact?.end) return null;
  const target = new Date(`${fact.end}T00:00:00Z`);
  target.setUTCFullYear(target.getUTCFullYear() - 1);
  return facts.find((candidate) => {
    const difference = Math.abs(new Date(`${candidate.end}T00:00:00Z`) - target) / 86400000;
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

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseInlineContexts(xml) {
  const contexts = new Map();
  for (const match of xml.matchAll(/<context\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/context>/g)) {
    const instant = match[2].match(/<instant>([^<]+)<\/instant>/)?.[1];
    const end = instant || match[2].match(/<endDate>([^<]+)<\/endDate>/)?.[1];
    const start = match[2].match(/<startDate>([^<]+)<\/startDate>/)?.[1];
    const duration = start && end ? Math.round((new Date(end) - new Date(start)) / 86400000) : 0;
    if (end) contexts.set(match[1], {
      end,
      duration,
      consolidated: !/<segment>|<scenario>/.test(match[2]),
    });
  }
  return contexts;
}

function extractInlineMetric(xml, definition, contexts = parseInlineContexts(xml)) {
  const concept = escapeRegex(definition.concept);
  const pattern = new RegExp(`<${concept}\\s+([^>]*)>([^<]+)<\\/${concept}>`, "g");
  const facts = [];
  for (const match of xml.matchAll(pattern)) {
    const attributes = Object.fromEntries(
      [...match[1].matchAll(/([\w:]+)="([^"]*)"/g)].map((item) => [item[1], item[2]]),
    );
    if (definition.unit && attributes.unitRef !== definition.unit) continue;
    const context = contexts.get(attributes.contextRef);
    const value = Number(String(match[2]).replace(/,/g, ""));
    if (context?.consolidated && context.duration <= 120 && Number.isFinite(value)) {
      facts.push({ period: context.end, value });
    }
  }
  return facts;
}

function humanizeConcept(concept) {
  return concept
    .replace(/^.*:/, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/\bAnd\b/g, "and")
    .trim();
}

function inferCustomFormat(unit, values) {
  const normalized = String(unit || "").toLowerCase();
  if (normalized === "usd") return "money";
  if (["shares", "member"].includes(normalized)) return "millions";
  if (normalized === "number") return "number";
  if (normalized === "pure" && values.every((value) => Math.abs(value) <= 2)) return "ratio";
  return null;
}

function discoverInlineMetrics(xml, contexts = parseInlineContexts(xml)) {
  const standardNamespaces = new Set(["us-gaap", "dei", "srt", "country", "currency", "xbrli", "link"]);
  const excluded = /TextBlock|Abstract|Axis|Domain|Table|Policy|Disclosure|Schedule|Member$/i;
  const operatingConcept = /Revenue|Sales|Member|User|Subscriber|Customer|Shipment|Deliver|Device|Premium|Claim|Fulfillment|Technology|Infrastructure|DataCenter|Cloud|Advertising|Booking|Backlog|RemainingPerformance|Warranty|Inventory|Capacity|Royalty|License|Product|Service|Expense|Income|Margin|Rate|Percentage/i;
  const accountingConcept = /Liabilit|Payable|Receivable|Lease|Tax|Deferred|Debt|Securit|Investment|Hedge|Derivative|Obligation|Commitment|Accru|Reinsurance|Goodwill|Intangible|Stock|Share|FairValue|RightOfUse|Prepaid|Proceeds|Allowance|PropertyPlant|Miscellaneous|OtherOther|CrossLicense/i;
  const discovered = [];
  const pattern = /<([a-z][\w-]*:[A-Za-z][\w]*)\s+([^>]*)>([^<]+)<\/\1>/g;
  for (const match of xml.matchAll(pattern)) {
    if (standardNamespaces.has(match[1].split(":")[0])) continue;
    if (excluded.test(match[1])) continue;
    if (!operatingConcept.test(match[1]) || accountingConcept.test(match[1])) continue;
    const attributes = Object.fromEntries(
      [...match[2].matchAll(/([\w:]+)="([^"]*)"/g)].map((item) => [item[1], item[2]]),
    );
    const context = contexts.get(attributes.contextRef);
    const value = Number(String(match[3]).replace(/,/g, ""));
    if (!context?.consolidated || context.duration > 120 || !Number.isFinite(value)) continue;
    discovered.push({
      concept: match[1],
      period: context.end,
      value,
      unit: attributes.unitRef,
    });
  }
  return discovered;
}

function scoreDiscoveredMetric(concept, facts) {
  const name = concept.replace(/^.*:/, "");
  let score = Math.min(facts.length, 8) * 10;
  if (/Member|User|Subscriber|Customer|Shipment|Deliver|Booking|Backlog|RemainingPerformance/i.test(name)) score += 45;
  if (/Revenue|Sales|Premium|Claim|Margin|Rate|Percentage/i.test(name)) score += 35;
  if (/Fulfillment|Technology|Infrastructure|DataCenter|Cloud|Advertising|Capacity|Warranty|Royalty|License|Product|Service/i.test(name)) score += 20;
  if (/Expense|Income/i.test(name)) score += 5;
  if (/Adjustment|Ceded|Commission|Gross|Net|Current|Noncurrent/i.test(name)) score -= 15;
  return score;
}

function buildMetric(metric, facts) {
  const byPeriod = new Map();
  for (const fact of facts) byPeriod.set(fact.period, fact);
  const series = [...byPeriod.values()].sort((a, b) => a.period.localeCompare(b.period)).slice(-8);
  return {
    id: metric.id,
    title: metric.title,
    description: metric.description,
    labels: series.map((fact) => labelQuarter({ end: fact.period })),
    values: series.map((fact) => fact.value),
    displayValues: series.map((fact) => formatCustomMetric(fact.value, metric.format)),
    latest: formatCustomMetric(series.at(-1)?.value, metric.format),
    latestPeriod: series.at(-1)?.period || null,
    source: "SEC inline XBRL",
  };
}

async function fetchCompanySpecificMetrics(config) {
  const tickerConfig = companyMetricConfig[config.ticker] || {};
  const defaults = companyMetricConfig._defaults || {};
  const configured = tickerConfig.metrics || [];
  const autoDiscover = tickerConfig.autoDiscover ?? defaults.autoDiscover ?? false;
  const maxMetrics = tickerConfig.maxMetrics ?? defaults.maxMetrics ?? 20;
  if (!configured.length && !autoDiscover) return [];

  const submissions = await fetchJson(
    `https://data.sec.gov/submissions/CIK${config.cik}.json`,
    { "User-Agent": secIdentity },
  );
  const recent = submissions.filings?.recent || {};
  const filings = (recent.form || [])
    .map((form, index) => ({
      form,
      accession: recent.accessionNumber[index],
      document: recent.primaryDocument[index],
    }))
    .filter((filing) => ["10-Q", "10-K"].includes(filing.form) && filing.document)
    .slice(0, 12);

  const valuesByMetric = new Map(configured.map((metric) => [metric.id, []]));
  const discoveredByConcept = new Map();
  for (const filing of filings) {
    const accession = filing.accession.replace(/-/g, "");
    const instanceName = filing.document.replace(/\.htm$/i, "_htm.xml");
    const url = `https://www.sec.gov/Archives/edgar/data/${Number(config.cik)}/${accession}/${instanceName}`;
    try {
      const response = await fetch(url, { headers: { "User-Agent": secIdentity } });
      if (!response.ok) continue;
      const xml = await response.text();
      const contexts = parseInlineContexts(xml);
      for (const metric of configured) {
        valuesByMetric.get(metric.id).push(...extractInlineMetric(xml, metric, contexts));
      }
      if (autoDiscover) {
        for (const fact of discoverInlineMetrics(xml, contexts)) {
          if (!discoveredByConcept.has(fact.concept)) discoveredByConcept.set(fact.concept, []);
          discoveredByConcept.get(fact.concept).push(fact);
        }
      }
    } catch {
      // A missing older inline instance should not block the company refresh.
    }
    await delay(120);
  }

  const explicitConcepts = new Set(configured.map((metric) => metric.concept));
  const explicitMetrics = configured
    .map((metric) => buildMetric(metric, valuesByMetric.get(metric.id)))
    .filter((metric) => metric.values.length);
  const discoveredMetrics = [...discoveredByConcept.entries()]
    .filter(([concept]) => !explicitConcepts.has(concept))
    .map(([concept, facts]) => {
      const byPeriod = new Map(facts.map((fact) => [fact.period, fact]));
      const series = [...byPeriod.values()].sort((a, b) => a.period.localeCompare(b.period));
      const format = inferCustomFormat(series.at(-1)?.unit, series.map((fact) => fact.value));
      if (!format || series.length < 2) return null;
      return {
        score: scoreDiscoveredMetric(concept, series),
        metric: buildMetric({
          id: concept.replace(/^.*:/, ""),
          title: humanizeConcept(concept),
          description: "Company-specific metric reported in SEC filings.",
          format,
        }, series),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.metric.title.length - b.metric.title.length)
    .slice(0, Math.max(0, maxMetrics - explicitMetrics.length))
    .map(({ metric }) => metric);
  return [...explicitMetrics, ...discoveredMetrics];
}

function buildCompany(config, companyFacts, alpha, customMetrics = []) {
  const revenueFacts = getUnitFacts(companyFacts, conceptCandidates.revenue, ["USD"]);
  const epsFacts = getUnitFacts(companyFacts, conceptCandidates.eps, ["USD/shares", "USD / shares"]);
  const dilutedShareFacts = getUnitFacts(companyFacts, conceptCandidates.dilutedShares, ["shares"]);
  const netIncomeFacts = getUnitFacts(companyFacts, conceptCandidates.netIncome, ["USD"]);
  const operatingIncomeFacts = getUnitFacts(companyFacts, conceptCandidates.operatingIncome, ["USD"]);
  const premiumsEarnedFacts = getUnitFacts(companyFacts, conceptCandidates.premiumsEarned, ["USD"]);
  const claimsIncurredFacts = getUnitFacts(companyFacts, conceptCandidates.claimsIncurred, ["USD"]);
  const sellingGeneralAdministrativeFacts = getUnitFacts(
    companyFacts,
    conceptCandidates.sellingGeneralAdministrative,
    ["USD"],
  );
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
  const reportedEpsQuarterly = quarterlySeries(epsFacts);
  if (epsAnnual.length < 2) epsAnnual.push(...rawEpsAnnual);
  if (epsQuarterly.length < 2) epsQuarterly.push(...reportedEpsQuarterly);
  const operatingIncomeAnnual = annualSeries(operatingIncomeFacts);
  const operatingIncomeQuarterly = quarterlySeries(operatingIncomeFacts);
  const premiumsEarnedQuarterly = quarterlySeries(premiumsEarnedFacts);
  const claimsIncurredQuarterly = quarterlySeries(claimsIncurredFacts);
  const sellingGeneralAdministrativeQuarterly = quarterlySeries(sellingGeneralAdministrativeFacts);
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
  const fcfMargin = latestRevenue && Number.isFinite(freeCashFlow)
    ? (freeCashFlow / latestRevenue) * 100
    : null;
  const operatingMargin = latestRevenue && Number.isFinite(latestOperatingIncome)
    ? (latestOperatingIncome / latestRevenue) * 100
    : null;
  const latestFiscalPeriod = revenueAnnual.at(-1) ? labelAnnual(revenueAnnual.at(-1)) : null;

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
  const latestQuarterRevenue = revenueQuarterly.at(-1);
  const priorYearQuarterRevenue = priorYearPeriod(revenueQuarterly, latestQuarterRevenue);
  const latestQuarterNetIncome = closestPeriod(netIncomeQuarterly, latestQuarterRevenue?.end);
  const latestQuarterOperatingIncome = closestPeriod(operatingIncomeQuarterly, latestQuarterRevenue?.end);
  const latestQuarterPremiums = closestPeriod(premiumsEarnedQuarterly, latestQuarterRevenue?.end);
  const latestQuarterClaims = closestPeriod(claimsIncurredQuarterly, latestQuarterRevenue?.end);
  const latestQuarterSga = closestPeriod(sellingGeneralAdministrativeQuarterly, latestQuarterRevenue?.end);
  const latestQuarterEps = closestPeriod(reportedEpsQuarterly, latestQuarterRevenue?.end)
    || closestPeriod(epsQuarterly, latestQuarterRevenue?.end);
  const priorYearQuarterEps = priorYearPeriod(epsQuarterly, latestQuarterEps);
  const priorYearQuarterNetIncome = priorYearPeriod(netIncomeQuarterly, latestQuarterNetIncome);
  const latestQuarterMargin = latestQuarterRevenue?.val && latestQuarterNetIncome?.val
    ? (latestQuarterNetIncome.val / latestQuarterRevenue.val) * 100
    : null;
  const priorYearQuarterMargin = priorYearQuarterRevenue?.val && priorYearQuarterNetIncome?.val
    ? (priorYearQuarterNetIncome.val / priorYearQuarterRevenue.val) * 100
    : null;
  const quarterlyRevenueGrowth = percentChange(latestQuarterRevenue?.val, priorYearQuarterRevenue?.val);
  const medicalLossRatio = latestQuarterPremiums?.val && latestQuarterClaims?.val
    ? (latestQuarterClaims.val / latestQuarterPremiums.val) * 100
    : null;
  const quarterDetails = [
    ["Revenue", formatMoney(latestQuarterRevenue?.val), "SEC reported"],
    ["Revenue YoY", formatPercent(percentChange(latestQuarterRevenue?.val, priorYearQuarterRevenue?.val)), "Same quarter prior year"],
    ["Diluted EPS", Number.isFinite(latestQuarterEps?.val) ? `$${latestQuarterEps.val.toFixed(2)}` : "N/A", latestQuarterEps?.dilutedShares ? "Calculated" : "SEC reported"],
    ["Net income", formatMoney(latestQuarterNetIncome?.val), "SEC reported"],
    ["Net margin", Number.isFinite(latestQuarterMargin) ? `${latestQuarterMargin.toFixed(1)}%` : "N/A", "Calculated"],
    ["Operating income", formatMoney(latestQuarterOperatingIncome?.val), "SEC reported"],
  ];
  if (Number.isFinite(latestQuarterPremiums?.val)) {
    quarterDetails.push(
      ["Premiums earned", formatMoney(latestQuarterPremiums.val), "SEC reported"],
      ["Claims incurred", formatMoney(latestQuarterClaims?.val), "SEC reported"],
      ["Medical loss ratio", Number.isFinite(medicalLossRatio) ? `${medicalLossRatio.toFixed(1)}%` : "N/A", "Calculated"],
      ["SG&A expense", formatMoney(latestQuarterSga?.val), "SEC reported"],
    );
  }
  const annualEpsDisplay = describeEpsChange(
    latestEps,
    priorEps,
    formatPercent((epsGrowth ?? 0) - (priorEpsGrowth ?? 0), 1).replace("%", " pts"),
    "Diluted EPS, latest fiscal year",
  );
  const quarterlyEpsDisplay = describeEpsChange(
    latestQuarterEps?.val,
    priorYearQuarterEps?.val,
    "Same quarter prior year",
    "Compared with same quarter last year",
  );
  const annualSummaryMetrics = [
    ["Revenue growth", formatPercent(revenueGrowth), formatPercent((revenueGrowth ?? 0) - (priorRevenueGrowth ?? 0), 1).replace("%", " pts"), "Latest reported fiscal year"],
    ["EPS growth", ...annualEpsDisplay],
    ["Net margin", Number.isFinite(netMargin) ? `${netMargin.toFixed(1)}%` : "N/A", formatPercent((netMargin ?? 0) - (priorNetMargin ?? 0), 1).replace("%", " pts"), "Calculated from SEC filings"],
    ["Forward P/E", formatMultiple(pe), "Provider", alpha ? "Alpha Vantage overview" : "Add Alpha Vantage key"],
  ];
  const quarterlySummaryMetrics = [
    ["Revenue growth", formatPercent(quarterlyRevenueGrowth), "Same quarter prior year", "Compared with same quarter last year"],
    ["EPS growth", ...quarterlyEpsDisplay],
    ["Net margin", Number.isFinite(latestQuarterMargin) ? `${latestQuarterMargin.toFixed(1)}%` : "N/A", Number.isFinite(latestQuarterMargin) && Number.isFinite(priorYearQuarterMargin) ? formatPercent(latestQuarterMargin - priorYearQuarterMargin, 1).replace("%", " pts") : "N/A", "Compared with same quarter last year"],
    ["Forward P/E", formatMultiple(pe), "Provider", alpha ? "Alpha Vantage overview" : "Add Alpha Vantage key"],
  ];

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
    metrics: annualSummaryMetrics,
    periodMetrics: { annual: annualSummaryMetrics, quarterly: quarterlySummaryMetrics },
    signals: [
      ["FCF yield", Number.isFinite(fcfYield) ? `${fcfYield.toFixed(1)}%` : "N/A"],
      ["ROE", Number.isFinite(roe) ? `${roe.toFixed(1)}%` : "N/A"],
      ["Debt / op. income", formatMultiple(debtToOperatingIncome)],
      ["Revenue CAGR", Number.isFinite(revenueCagr) ? `${revenueCagr.toFixed(1)}%` : "N/A"],
    ],
    annual,
    quarterly: quarterly.labels.length >= 2 ? quarterly : annual,
    quarterDetail: {
      period: latestQuarterRevenue ? labelQuarter(latestQuarterRevenue) : "Latest quarter",
      filed: latestQuarterRevenue?.filed || null,
      items: quarterDetails,
    },
    financialMetrics: [
      { title: "Free cash flow", value: formatMoney(freeCashFlow), note: "Calculated", period: latestFiscalPeriod },
      { title: "Operating cash flow", value: formatMoney(latestOperatingCashFlow), note: "SEC reported", period: latestFiscalPeriod },
      { title: "Capital expenditures", value: formatMoney(latestCapex), note: "SEC reported", period: latestFiscalPeriod },
      { title: "FCF margin", value: Number.isFinite(fcfMargin) ? `${fcfMargin.toFixed(1)}%` : "N/A", note: "Calculated", period: latestFiscalPeriod },
      { title: "Operating margin", value: Number.isFinite(operatingMargin) ? `${operatingMargin.toFixed(1)}%` : "N/A", note: "Calculated", period: latestFiscalPeriod },
      { title: "ROE", value: Number.isFinite(roe) ? `${roe.toFixed(1)}%` : "N/A", note: "Calculated", period: latestFiscalPeriod },
      { title: "Debt / op. income", value: formatMultiple(debtToOperatingIncome), note: "Calculated", period: latestFiscalPeriod },
      { title: "Revenue CAGR", value: Number.isFinite(revenueCagr) ? `${revenueCagr.toFixed(1)}%` : "N/A", note: "Calculated", period: latestFiscalPeriod },
    ],
    customMetrics,
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
  let customMetrics = [];
  try {
    customMetrics = await fetchCompanySpecificMetrics(config);
  } catch (error) {
    console.warn(`  Company metrics skipped: ${error.message}`);
  }
  return buildCompany(config, companyFacts, alpha, customMetrics);
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
