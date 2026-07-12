import test from "node:test";
import assert from "node:assert/strict";
import {
  extractFilingText,
  generateQuarterlySummary,
  quarterlyFilingIdentity,
  resolveQuarterlyFiling,
} from "../scripts/report-summary.mjs";

const company = {
  ticker: "TEST",
  quarterDetail: { period: "FY26 Q2" },
  sources: {
    fundamentals: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000123456.json",
    fundamentalsAsOf: {
      quarterPeriod: "FY26 Q2",
      latestCheck: {
        latestFiling: {
          form: "10-Q",
          accessionNumber: "0000123456-26-000010",
          primaryDocument: "test-20260331.htm",
          reportDate: "2026-03-31",
          filed: "2026-05-01",
        },
      },
    },
  },
};

test("builds a stable SEC filing identity from the accession number", () => {
  const filing = quarterlyFilingIdentity(company);
  assert.equal(filing.accessionNumber, "0000123456-26-000010");
  assert.equal(filing.fiscalPeriod, "FY26 Q2");
  assert.equal(
    filing.sourceUrl,
    "https://www.sec.gov/Archives/edgar/data/123456/000012345626000010/test-20260331.htm",
  );
});

test("extracts readable filing text and removes executable markup", () => {
  const html = `
    <html><style>.hidden{display:none}</style><script>steal()</script><body>
    Cover page noise
    <h2>Item 1. Financial Statements</h2>
    <p>Revenue was $12.3 billion &amp; operating cash flow improved.</p>
    <h2>Item 2. Management's Discussion and Analysis</h2>
    <p>Demand increased year over year.</p>
    </body></html>`;
  const text = extractFilingText(html);
  assert.match(text, /Item 1\. Financial Statements/);
  assert.match(text, /Revenue was \$12\.3 billion & operating cash flow improved/);
  assert.doesNotMatch(text, /steal|display:none|Cover page noise/);
});

test("resolves the latest 10-Q from SEC submissions when the embedded latest filing is annual", async () => {
  const annualCompany = structuredClone(company);
  annualCompany.sources.fundamentalsAsOf.latestCheck.latestFiling.form = "10-K";
  const filing = await resolveQuarterlyFiling(annualCompany, {
    secIdentity: "Northstar test@example.com",
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        filings: { recent: {
          form: ["10-K", "10-Q"],
          accessionNumber: ["annual", "0000123456-25-000099"],
          primaryDocument: ["annual.htm", "quarter.htm"],
          reportDate: ["2025-12-31", "2025-09-30"],
          filingDate: ["2026-02-01", "2025-11-01"],
        } },
      }),
    }),
  });
  assert.equal(filing.form, "10-Q");
  assert.equal(filing.accessionNumber, "0000123456-25-000099");
});

test("requests a non-stored structured summary and parses the model response", async () => {
  const requests = [];
  const filing = quarterlyFilingIdentity(company);
  const expected = {
    headline: { en: "Quarter improved", zh: "季度改善" },
    overview: { en: "Revenue grew.", zh: "营收增长。" },
    keyItems: Array.from({ length: 3 }, (_, index) => ({
      category: "growth",
      title: { en: `Item ${index + 1}`, zh: `事项 ${index + 1}` },
      detail: { en: "Reported fact.", zh: "已报告事实。" },
      evidence: "SEC filing",
    })),
    watchItems: [],
    limitations: { en: "Based on the filing.", zh: "基于该文件。" },
  };
  const result = await generateQuarterlySummary(company, filing, {
    openaiKey: "test-key",
    secIdentity: "Northstar test@example.com",
    fetchImpl: async (url, options = {}) => {
      requests.push({ url, options });
      if (String(url).includes("sec.gov")) {
        return { ok: true, text: async () => `<h2>Item 1. Financial Statements</h2><p>${"Reported revenue and cash flow. ".repeat(60)}</p>` };
      }
      return {
        ok: true,
        json: async () => ({ output: [{ content: [{ type: "output_text", text: JSON.stringify(expected) }] }] }),
      };
    },
  });
  const body = JSON.parse(requests[1].options.body);
  assert.equal(body.store, false);
  assert.equal(body.text.format.type, "json_schema");
  assert.deepEqual(result.payload, expected);
  assert.equal(result.sourceHash.length, 64);
});
