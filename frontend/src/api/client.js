// Small wrapper around fetch() so components don't deal with URLs or
// HTTP status codes directly. Every function throws on non-2xx so
// components can wrap calls in try/catch.

async function request(path) {
  const res = await fetch(path);
  if (!res.ok) {
    let msg = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      if (body && body.error) msg = body.error;
    } catch (_) {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(msg);
  }
  return res.json();
}

// Build a query string from an object, skipping empty values.
function toQuery(params = {}) {
  const parts = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
  }
  return parts.length ? "?" + parts.join("&") : "";
}

export function fetchProperties(params = {}) {
  return request(`/api/properties${toQuery(params)}`);
}

export function fetchPropertyDetail(id) {
  return request(`/api/properties/${encodeURIComponent(id)}`);
}

export function fetchOpenHouses(id) {
  return request(`/api/properties/${encodeURIComponent(id)}/openhouses`);
}
