// Base URL for the backend API.
// - In local dev, Vite proxies "/api" -> http://localhost:5000 (see vite.config.js),
//   so the default "/api" works with zero config.
// - For a future production deploy, set VITE_API_BASE_URL to the backend origin,
//   e.g. VITE_API_BASE_URL=https://api.example.com/api
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const DEFAULT_TIMEOUT_MS = 10000;

export async function fetchApi(endpoint, { timeoutMs = DEFAULT_TIMEOUT_MS, signal, method = "GET", body } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // Allow callers to pass their own AbortSignal (e.g. React cleanup).
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", () => controller.abort(), { once: true });
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new Error(
        `Request to ${endpoint} timed out after ${timeoutMs}ms. Is the backend running on port 5000?`,
        { cause: err }
      );
    }
    throw new Error(
      `Cannot reach the backend at ${BASE_URL}${endpoint}. Is the backend running (npm run dev in backend/)?`,
      { cause: err }
    );
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export { BASE_URL };
