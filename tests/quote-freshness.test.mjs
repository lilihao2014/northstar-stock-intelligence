import assert from "node:assert/strict";
import test from "node:test";
import {
  marketDateKey,
  parseFreshnessDate,
  prepareDashboardForRead,
  quoteFreshness,
  sanitizeCompanyForRead,
} from "../scripts/server.mjs";

function company(quoteAsOf, overrides = {}) {
  return {
    ticker: "AAPL",
    price: 123.45,
    change: 1.2,
    cap: "$1.23T",
    sources: {
      quote: "Nasdaq delayed quote",
      quoteAsOf,
    },
    ...overrides,
  };
}

test("parses Nasdaq quote timestamps that end with ET", () => {
  const parsed = parseFreshnessDate("Jun 30, 2026 5:55 PM ET");
  assert.ok(parsed instanceof Date);
  assert.equal(Number.isFinite(parsed.getTime()), true);
  assert.equal(marketDateKey(parsed), "2026-06-30");
});

test("classifies same-market-day dated quote as current and displayable", () => {
  const today = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  const freshness = quoteFreshness(company(`${today} 4:05 PM ET`));
  assert.equal(freshness.status, "current");
  assert.equal(freshness.label, "Today quote");
  assert.equal(freshness.displayable, true);
});

test("classifies prior market date quote as previous close but keeps it displayable", () => {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const quoteAsOf = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(yesterday);
  const freshness = quoteFreshness(company(`${quoteAsOf} 4:05 PM ET`));
  assert.equal(freshness.status, "previous-close");
  assert.equal(freshness.label, "Previous close");
  assert.equal(freshness.displayable, true);
});

test("hides undated quotes instead of displaying stale numeric prices", () => {
  const sanitized = sanitizeCompanyForRead(company(null));
  assert.equal(sanitized.price, null);
  assert.equal(sanitized.change, 0);
  assert.equal(sanitized.cap, "Quote key required");
  assert.equal(sanitized.sources.quoteFreshness.status, "missing-date");
  assert.equal(sanitized.sources.quoteFreshness.displayable, false);
});

test("hides quotes older than the freshness window", () => {
  const oldQuote = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
  const sanitized = sanitizeCompanyForRead(company(oldQuote.toISOString()));
  assert.equal(sanitized.price, null);
  assert.equal(sanitized.sources.quoteFreshness.status, "stale");
  assert.equal(sanitized.sources.quoteFreshness.displayable, false);
});

test("dashboard read preparation annotates freshness and only sanitizes bad quotes", () => {
  const today = new Date().toISOString();
  const prepared = prepareDashboardForRead({
    generatedAt: today,
    companies: {
      GOOD: company(today, { ticker: "GOOD" }),
      BAD: company(null, { ticker: "BAD" }),
    },
  });
  assert.equal(prepared.companies.GOOD.price, 123.45);
  assert.equal(prepared.companies.BAD.price, null);
  assert.deepEqual(prepared.freshness.staleQuotes, ["BAD"]);
  assert.equal(prepared.freshness.dashboardStatus, "fresh");
});
