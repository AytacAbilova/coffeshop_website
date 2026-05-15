const STORAGE_KEYS = {
  auth: "admin_auth",
  menu: "admin_menu_items",
  staff: "admin_staff",
  tables: "admin_tables",
  cart: "shop_cart",
  orders: "shop_orders",
  reservations: "shop_reservations",
};

const API_BASE_URL = "https://simulation2-production-7983.up.railway.app";

const TOKEN_KEYS = {
  access: "accessToken",
  refresh: "refreshToken",
  legacyAccess: "token",
};

function safeParseJson(value, fallback) {
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return safeParseJson(raw, fallback);
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const DEFAULT_MENU = [
  {
    id: "m1",
    category: "drink",
    name: "Espresso",
    price: 3.5,
    imageUrl: "",
  },
  {
    id: "m2",
    category: "food",
    name: "Croissant",
    price: 4,
    imageUrl: "",
  },
];

const DEFAULT_STAFF = [
  { id: "s1", name: "Ofisiant 1", phone: "", active: true },
];

const DEFAULT_TABLES = Array.from({ length: 10 }, (_, i) => ({
  id: `t${i + 1}`,
  number: i + 1,
  capacity: 4,
  status: "available",
}));

export function isAdminAuthed() {
  try {
    return localStorage.getItem(STORAGE_KEYS.auth) === "1";
  } catch {
    return false;
  }
}

export function setAdminAuthed() {
  try {
    localStorage.setItem(STORAGE_KEYS.auth, "1");
  } catch {
    return;
  }
}

export function clearAdminAuth() {
  try {
    localStorage.removeItem(STORAGE_KEYS.auth);
  } catch {
    return;
  }
}

export function getAccessToken() {
  try {
    return (
      localStorage.getItem(TOKEN_KEYS.access) ||
      localStorage.getItem(TOKEN_KEYS.legacyAccess) ||
      ""
    );
  } catch {
    return "";
  }
}

export function getRefreshToken() {
  try {
    return localStorage.getItem(TOKEN_KEYS.refresh) || "";
  } catch {
    return "";
  }
}

export function setAuthTokens({ accessToken, refreshToken }) {
  try {
    if (accessToken) {
      localStorage.setItem(TOKEN_KEYS.access, accessToken);
      localStorage.setItem(TOKEN_KEYS.legacyAccess, accessToken);
    }
    if (refreshToken) {
      localStorage.setItem(TOKEN_KEYS.refresh, refreshToken);
    }
  } catch {
    return;
  }
}

export function clearAuthTokens() {
  try {
    localStorage.removeItem(TOKEN_KEYS.access);
    localStorage.removeItem(TOKEN_KEYS.legacyAccess);
    localStorage.removeItem(TOKEN_KEYS.refresh);
  } catch {
    return;
  }
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    const json = atob(padded);
    return safeParseJson(json, null);
  } catch {
    return null;
  }
}

export function isAccessTokenExpired(accessToken, skewSeconds = 30) {
  const payload = decodeJwtPayload(accessToken);
  const exp = payload?.exp;
  if (!Number.isFinite(exp)) return false;
  const now = Math.floor(Date.now() / 1000);
  return exp <= now + Math.max(0, Math.floor(skewSeconds));
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return "";

  const res = await fetch(`${API_BASE_URL}/api/Auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return "";
  const data = await res.json();
  const accessToken = data?.accessToken || "";
  const nextRefresh = data?.refreshToken || refreshToken;
  if (!accessToken) return "";
  setAuthTokens({ accessToken, refreshToken: nextRefresh });
  return accessToken;
}

export async function ensureValidAccessToken() {
  const token = getAccessToken();
  if (token && !isAccessTokenExpired(token)) return token;
  return await refreshAccessToken();
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return safeParseJson(raw, null);
  } catch {
    return null;
  }
}

export function getCurrentUserId() {
  const user = getCurrentUser();
  const id = user?.userId ?? user?.id ?? user?.customerId;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
}

async function authorizedJsonFetch(path, options = {}) {
  const token = await ensureValidAccessToken();
  if (!token) return { ok: false, status: 401, data: null };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) return { ok: false, status: res.status, data: null };

  try {
    const data = await res.json();
    return { ok: true, status: res.status, data };
  } catch {
    return { ok: true, status: res.status, data: null };
  }
}

export async function apiCreateOrder({ customerId, tableId, items }) {
  const cid = Number(customerId);
  if (!Number.isFinite(cid) || cid <= 0) {
    return { ok: false, status: 400, data: null };
  }

  const payload = {
    tableId: Number(tableId) || 0,
    items: Array.isArray(items) ? items : [],
  };

  return await authorizedJsonFetch(`/api/Orders?customerId=${cid}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function apiGetOrderById(id) {
  const raw = typeof id === "string" ? id.trim() : String(id ?? "");
  if (!raw) return { ok: false, status: 400, data: null };
  const asNumber = Number(raw);
  const pathId = Number.isFinite(asNumber) ? String(asNumber) : encodeURIComponent(raw);
  return await authorizedJsonFetch(`/api/Orders/${pathId}`);
}

export async function apiDeleteOrder(id) {
  const raw = typeof id === "string" ? id.trim() : String(id ?? "");
  if (!raw) return { ok: false, status: 400, data: null };
  const asNumber = Number(raw);
  const pathId = Number.isFinite(asNumber) ? String(asNumber) : encodeURIComponent(raw);
  return await authorizedJsonFetch(`/api/Orders/${pathId}`, {
    method: "DELETE",
  });
}

export async function apiGetOrdersByCustomer(customerId) {
  const cid = Number(customerId);
  if (!Number.isFinite(cid) || cid <= 0) {
    return { ok: false, status: 400, data: null };
  }

  return await authorizedJsonFetch(`/api/Orders/${cid}`);
}


export async function apiGetOrdersByTable(tableId) {
  return await authorizedJsonFetch(`/api/Orders?tableId=${Number(tableId)}`);
}

export function getMenuItems() {
  const data = loadJson(STORAGE_KEYS.menu, null);
  if (Array.isArray(data)) return data;
  saveJson(STORAGE_KEYS.menu, DEFAULT_MENU);
  return DEFAULT_MENU;
}

export function saveMenuItems(items) {
  saveJson(STORAGE_KEYS.menu, items);
}

export function getStaff() {
  const data = loadJson(STORAGE_KEYS.staff, null);
  if (Array.isArray(data)) return data;
  saveJson(STORAGE_KEYS.staff, DEFAULT_STAFF);
  return DEFAULT_STAFF;
}

export function saveStaff(staff) {
  saveJson(STORAGE_KEYS.staff, staff);
}

export function getTables() {
  const data = loadJson(STORAGE_KEYS.tables, null);
  if (Array.isArray(data)) return data;
  saveJson(STORAGE_KEYS.tables, DEFAULT_TABLES);
  return DEFAULT_TABLES;
}

export function saveTables(tables) {
  saveJson(STORAGE_KEYS.tables, tables);
}

export function ensureTableCount(currentTables, desiredCount) {
  const safeDesired = Number.isFinite(desiredCount)
    ? Math.max(0, Math.floor(desiredCount))
    : currentTables.length;

  const normalized = Array.isArray(currentTables) ? [...currentTables] : [];
  const existing = normalized
    .filter((t) => t && Number.isFinite(Number(t.number)))
    .map((t) => ({
      number: Number(t.number),
      status: typeof t.status === "string" ? t.status : "available",
    }))
    .sort((a, b) => a.number - b.number);

  const trimmed = existing.slice(0, safeDesired);
  const start = trimmed.length ? trimmed[trimmed.length - 1].number + 1 : 1;
  const toAdd = safeDesired - trimmed.length;
  for (let i = 0; i < toAdd; i += 1) {
    trimmed.push({ number: start + i, status: "available" });
  }
  return trimmed;
}

export function newMenuItem() {
  return {
    id: createId(),
    category: "drink",
    name: "",
    price: "",
    imageUrl: "",
  };
}

export function newStaffMember() {
  return {
    id: createId(),
    name: "",
    phone: "",
    active: true,
  };
}

export function getCart() {
  const data = loadJson(STORAGE_KEYS.cart, null);
  if (Array.isArray(data)) return data;
  saveJson(STORAGE_KEYS.cart, []);
  return [];
}

export function saveCart(cart) {
  saveJson(STORAGE_KEYS.cart, cart);
}

export function getOrders() {
  const data = loadJson(STORAGE_KEYS.orders, null);
  if (Array.isArray(data)) return data;
  saveJson(STORAGE_KEYS.orders, []);
  return [];
}

export function saveOrders(orders) {
  saveJson(STORAGE_KEYS.orders, orders);
}

export function createOrder(orderInput) {
  const next = {
    id: createId(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...orderInput,
  };
  const orders = getOrders();
  saveOrders([next, ...orders]);
  return next;
}

export function getReservations() {
  const data = loadJson(STORAGE_KEYS.reservations, null);
  if (Array.isArray(data)) return data;
  saveJson(STORAGE_KEYS.reservations, []);
  return [];
}

export function saveReservations(reservations) {
  saveJson(STORAGE_KEYS.reservations, reservations);
}

export function createReservation(reservationInput) {
  const next = {
    id: createId(),
    createdAt: new Date().toISOString(),
    status: "pending",
    ...reservationInput,
  };
  const reservations = getReservations();
  saveReservations([next, ...reservations]);
  return next;
}




// ─── adminStorage.js-ə əlavə et ───────────────────────────────────────────────

const WISHLIST_KEY = "wishlist";

export function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addToWishlist(item) {
  const list = getWishlist();
  const exists = list.some((i) => i.id === item.id);
  if (exists) return false; // artıq var
  list.push({ ...item, addedAt: new Date().toISOString() });
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return true;
}

export function removeFromWishlist(id) {
  const list = getWishlist().filter((i) => i.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

export function clearWishlist() {
  localStorage.removeItem(WISHLIST_KEY);
}

export function isInWishlist(id) {
  return getWishlist().some((i) => i.id === id);
}
