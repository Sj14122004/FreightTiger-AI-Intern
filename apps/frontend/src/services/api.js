const API_BASE_URL = "http://localhost:5001/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

export async function fetchRouteMetrics() {
  return request("/all-routes/metrics");
}

export async function generateRouteAnalysis() {
  return request("/all-routes/generate", {
    method: "POST"
  });
}

export function getFinalOutputDownloadUrl() {
  return `${API_BASE_URL}/all-routes/download`;
}