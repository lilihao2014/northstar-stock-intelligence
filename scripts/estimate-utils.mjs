export function estimateSeries(payload, horizon) {
  if (!payload) return [];
  const normalizedHorizon = String(horizon).trim().toLowerCase();
  const legacyKey = normalizedHorizon === "fiscal quarter"
    ? "quarterlyEarningsEstimates"
    : "annualEarningsEstimates";
  if (Array.isArray(payload[legacyKey])) return payload[legacyKey];
  if (!Array.isArray(payload.estimates)) return [];
  return payload.estimates.filter((estimate) =>
    String(estimate?.horizon || "").trim().toLowerCase() === normalizedHorizon,
  );
}
