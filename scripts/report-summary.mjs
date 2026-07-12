import { createHash } from "node:crypto";

export const reportSummaryPromptVersion = "quarterly-v1";

const summarySchema = {
  type: "object",
  additionalProperties: false,
  required: ["headline", "overview", "keyItems", "watchItems", "limitations"],
  properties: {
    headline: bilingualSchema(),
    overview: bilingualSchema(),
    keyItems: {
      type: "array",
      minItems: 3,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "title", "detail", "evidence"],
        properties: {
          category: {
            type: "string",
            enum: ["growth", "profitability", "cash", "balance-sheet", "operations", "risk"],
          },
          title: bilingualSchema(),
          detail: bilingualSchema(),
          evidence: { type: "string" },
        },
      },
    },
    watchItems: {
      type: "array",
      maxItems: 5,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "detail"],
        properties: {
          title: bilingualSchema(),
          detail: bilingualSchema(),
        },
      },
    },
    limitations: bilingualSchema(),
  },
};

function bilingualSchema() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["en", "zh"],
    properties: {
      en: { type: "string" },
      zh: { type: "string" },
    },
  };
}

function companyCik(company) {
  const urlMatch = String(company?.sources?.fundamentals || "").match(/CIK(\d+)\.json/i);
  return urlMatch?.[1]?.padStart(10, "0") || null;
}

function filingUrl(cik, accessionNumber, primaryDocument) {
  const cikNumber = String(Number(cik));
  const accession = accessionNumber.replace(/-/g, "");
  return `https://www.sec.gov/Archives/edgar/data/${cikNumber}/${accession}/${primaryDocument}`;
}

export function quarterlyFilingIdentity(company, filing = company?.sources?.fundamentalsAsOf?.latestCheck?.latestFiling) {
  const cik = companyCik(company);
  if (!cik || !filing || !/^10-Q(?:\/A)?$/i.test(filing.form || "") || !filing.accessionNumber || !filing.primaryDocument) {
    return null;
  }
  return {
    ticker: company.ticker,
    cik,
    form: filing.form,
    accessionNumber: filing.accessionNumber,
    reportDate: filing.reportDate || null,
    filed: filing.filed || null,
    primaryDocument: filing.primaryDocument,
    fiscalPeriod: company.sources?.fundamentalsAsOf?.quarterPeriod || company.quarterDetail?.period || null,
    sourceUrl: filingUrl(cik, filing.accessionNumber, filing.primaryDocument),
  };
}

export async function resolveQuarterlyFiling(company, { fetchImpl = fetch, secIdentity = "" } = {}) {
  const embedded = quarterlyFilingIdentity(company);
  if (embedded) return embedded;
  const cik = companyCik(company);
  if (!cik || !secIdentity) return null;
  const response = await fetchImpl(`https://data.sec.gov/submissions/CIK${cik}.json`, {
    headers: { "User-Agent": secIdentity, Accept: "application/json" },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`SEC submissions returned HTTP ${response.status}`);
  const payload = await response.json();
  const recent = payload.filings?.recent || {};
  const index = (recent.form || []).findIndex((form) => /^10-Q(?:\/A)?$/i.test(form));
  if (index < 0) return null;
  return quarterlyFilingIdentity(company, {
    form: recent.form[index],
    accessionNumber: recent.accessionNumber?.[index],
    primaryDocument: recent.primaryDocument?.[index],
    reportDate: recent.reportDate?.[index],
    filed: recent.filingDate?.[index],
  });
}

export function extractFilingText(html, maximumCharacters = 120_000) {
  const decoded = String(html || "")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<(?:br|\/p|\/div|\/tr|\/li|\/h[1-6])\b[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
  const managementIndex = decoded.search(/item\s+2[.:\s]+management[’'s\s]+discussion/i);
  const financialIndex = decoded.search(/item\s+1[.:\s]+financial statements/i);
  const start = [financialIndex, managementIndex].filter((index) => index >= 0).sort((a, b) => a - b)[0] || 0;
  return decoded.slice(start, start + maximumCharacters);
}

function companyFacts(company) {
  return JSON.stringify({
    ticker: company.ticker,
    company: company.name,
    latestQuarter: company.quarterDetail || null,
    quarterlySeries: company.quarterly || null,
    financialMetrics: (company.financialMetrics || []).map(({ title, value, period }) => ({ title, value, period })),
    companySpecificMetrics: (company.customMetrics || []).slice(0, 30).map(({ title, latest, latestLabel }) => ({ title, latest, latestLabel })),
  });
}

function responseText(payload) {
  if (typeof payload.output_text === "string") return payload.output_text;
  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") return content.text;
    }
  }
  return "";
}

export async function generateQuarterlySummary(company, filing, {
  fetchImpl = fetch,
  openaiKey,
  model = "gpt-5-mini",
  secIdentity,
} = {}) {
  if (!openaiKey) throw new Error("OPENAI_API_KEY is not configured");
  if (!secIdentity) throw new Error("SEC_USER_AGENT is not configured");
  const filingResponse = await fetchImpl(filing.sourceUrl, {
    headers: { "User-Agent": secIdentity, Accept: "text/html,application/xhtml+xml" },
    signal: AbortSignal.timeout(20000),
  });
  if (!filingResponse.ok) throw new Error(`SEC filing returned HTTP ${filingResponse.status}`);
  const filingText = extractFilingText(await filingResponse.text());
  if (filingText.length < 1_000) throw new Error("SEC filing text is too short to summarize safely");
  const sourceHash = createHash("sha256").update(filingText).digest("hex");
  const apiResponse = await fetchImpl("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openaiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      instructions: "You are a careful public-company filing analyst. Use only the supplied SEC filing and structured facts. Never invent values, management claims, guidance, or risks. Distinguish reported facts from interpretation. Return concise English and Simplified Chinese text. This is research assistance, not investment advice.",
      input: `Summarize the latest quarterly report for ${company.name} (${company.ticker}), ${filing.fiscalPeriod || filing.reportDate || "latest quarter"}.\n\nStructured facts:\n${companyFacts(company)}\n\nSEC filing text:\n${filingText}`,
      max_output_tokens: 2400,
      text: {
        format: {
          type: "json_schema",
          name: "quarterly_report_summary",
          strict: true,
          schema: summarySchema,
        },
      },
    }),
    signal: AbortSignal.timeout(60000),
  });
  const payload = await apiResponse.json().catch(() => ({}));
  if (!apiResponse.ok) throw new Error(payload.error?.message || `OpenAI returned HTTP ${apiResponse.status}`);
  const output = responseText(payload);
  if (!output) throw new Error("OpenAI returned no summary text");
  return {
    payload: JSON.parse(output),
    sourceHash,
    model,
  };
}
