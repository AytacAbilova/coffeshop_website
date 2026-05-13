const STORAGE_KEYS = {
  auth: "admin_auth",
  menu: "admin_menu_items",
  staff: "admin_staff",
  tables: "admin_tables",
  cart: "shop_cart",
  orders: "shop_orders",
  reservations: "shop_reservations",
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
  number: i + 1,
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
