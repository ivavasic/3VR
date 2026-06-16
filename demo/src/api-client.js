const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function hasBackendConfigured() {
  return API_BASE_URL.length > 0;
}

export async function checkBackendHealth() {
  if (!hasBackendConfigured()) {
    return { ok: false, detail: "Backend URL is not configured." };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      return { ok: false, detail: `Backend returned ${response.status}.` };
    }

    return { ok: true, detail: await response.json() };
  } catch (error) {
    return { ok: false, detail: error.message };
  }
}
