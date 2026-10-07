const BASE_URL = import.meta.env.VITE_CORE_API_URL || "http://localhost:8080";

const ACCESS_KEY = "resqai.accessToken";
const REFRESH_KEY = "resqai.refreshToken";

export const tokens = {
  get access() { return localStorage.getItem(ACCESS_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_KEY); },
  save({ accessToken, refreshToken }) {
    if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message || `Request failed (${status})`);
    this.status = status;
    this.code = body?.code;
    this.fieldErrors = body?.fieldErrors || null;
  }
}

let refreshInFlight = null;

async function refreshAccessToken() {
  if (!tokens.refresh) return false;
  refreshInFlight ||= fetch(`${BASE_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: tokens.refresh }),
  })
    .then(async (res) => {
      if (!res.ok) { tokens.clear(); return false; }
      const body = await res.json();
      tokens.save(body.data);
      return true;
    })
    .finally(() => { refreshInFlight = null; });
  return refreshInFlight;
}

export async function request(path, { method = "GET", body, auth = true, retry = true } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth && tokens.access) headers.Authorization = `Bearer ${tokens.access}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (res.status === 401 && auth && retry && (await refreshAccessToken())) {
    return request(path, { method, body, auth, retry: false });
  }

  const payload = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, payload);
  return payload?.data ?? payload;
}

export const auth = {
  register: async (payload) => {
    const data = await request("/api/v1/auth/register", { method: "POST", body: payload, auth: false });
    tokens.save(data);
    return data.user;
  },
  login: async (email, password) => {
    const data = await request("/api/v1/auth/login", { method: "POST", body: { email, password }, auth: false });
    tokens.save(data);
    return data.user;
  },
  logout: async () => {
    try {
      await request("/api/v1/auth/logout", { method: "POST", body: { refreshToken: tokens.refresh } });
    } finally {
      tokens.clear();
    }
  },
  me: () => request("/api/v1/auth/me"),
  isSignedIn: () => Boolean(tokens.access),
};

export const users = {
  me: () => request("/api/v1/users/me"),
  updateProfile: (payload) => request("/api/v1/users/me", { method: "PATCH", body: payload }),
  updateLocation: (location) => request("/api/v1/users/me/location", { method: "PUT", body: location }),
};
