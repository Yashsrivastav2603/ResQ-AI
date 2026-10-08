// ---- DEMO MODE: runs fully in the browser, no backend needed ----
const ACCESS_KEY = "resqai.accessToken";
const REFRESH_KEY = "resqai.refreshToken";
const USER_KEY = "resqai.user";

export const tokens = {
  get access() { return localStorage.getItem(ACCESS_KEY); },
  get refresh() { return localStorage.getItem(REFRESH_KEY); },
  save({ accessToken, refreshToken } = {}) {
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

// ---------- local helpers ----------
const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
};

const writeUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
};

const startSession = () =>
  tokens.save({ accessToken: "demo-access-token", refreshToken: "demo-refresh-token" });

// Any page that still calls request() directly gets a clear error instead of a crash
export async function request(path) {
  throw new ApiError(503, { message: `Backend is not available in demo mode (${path})` });
}

// ---------- auth ----------
export const auth = {
  register: async (payload = {}) => {
    // never store passwords
    const { password, confirmPassword, ...safe } = payload;
    const user = writeUser({
      id: "RQ-USER-" + Date.now(),
      role: "CITIZEN",
      ...safe,
    });
    startSession();
    return user;
  },

  login: async (email, password) => {
    const saved = readUser();
    const user =
      saved && saved.email === email
        ? saved
        : writeUser({
            id: "RQ-USER-" + Date.now(),
            role: "CITIZEN",
            name: (email || "user").split("@")[0],
            email,
          });
    startSession();
    return user;
  },

  logout: async () => {
    tokens.clear();
  },

  me: async () => readUser(),
  isSignedIn: () => Boolean(tokens.access),
};

// ---------- users ----------
export const users = {
  me: async () => readUser(),

  updateProfile: async (payload = {}) => {
    const { password, confirmPassword, ...safe } = payload;
    return writeUser({ ...(readUser() || {}), ...safe });
  },

  updateLocation: async (location) =>
    writeUser({ ...(readUser() || {}), location }),
};
