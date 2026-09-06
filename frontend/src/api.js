const BASE_URL = "/api";

export async function fetchApi(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}
