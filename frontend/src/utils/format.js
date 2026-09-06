export function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return "N/A";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINNumber(value) {
  const n = Number(value);
  if (isNaN(n)) return "0";
  return n.toLocaleString("en-IN");
}

/**
 * Backend quirk: GET /dashboard/summary returns averageSalary as
 * Number(NULL) = 0 when salary_history is empty. Normalize so the UI
 * can distinguish "no data" (null) from a real 0 if needed.
 */
export function normalizeAverageSalary(value) {
  const n = Number(value);
  if (value === null || value === undefined || isNaN(n)) return null;
  return n;
}
