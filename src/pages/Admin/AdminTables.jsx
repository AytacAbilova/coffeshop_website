import { useMemo, useState } from "react";
import { ensureTableCount, getTables, saveTables } from "./adminStorage";

const styles = {
  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  },
  title: { margin: 0, fontSize: "14px", fontWeight: 950, color: "#111827" },
  field: { display: "grid", gap: "6px", fontSize: "13px", color: "#374151" },
  input: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
  },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  button: (variant) => ({
    padding: "10px 12px",
    borderRadius: "12px",
    border:
      variant === "danger"
        ? "1px solid rgba(239, 68, 68, 0.35)"
        : "1px solid rgba(79, 70, 229, 0.28)",
    background:
      variant === "danger"
        ? "rgba(239, 68, 68, 0.08)"
        : "rgba(79, 70, 229, 0.10)",
    color: variant === "danger" ? "#991b1b" : "#1e1b4b",
    cursor: "pointer",
    fontWeight: 900,
  }),
  grid: {
    marginTop: "12px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
  },
  card: {
    padding: "12px",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    background: "linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)",
    boxShadow: "0 10px 22px rgba(17, 24, 39, 0.06)",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },
  number: { margin: 0, fontWeight: 950, color: "#111827" },
  select: {
    padding: "8px 10px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
  },
  chip: (status) => {
    const map = {
      available: { bg: "rgba(34, 197, 94, 0.10)", border: "rgba(34, 197, 94, 0.22)", color: "#065f46" },
      reserved: { bg: "rgba(234, 179, 8, 0.12)", border: "rgba(234, 179, 8, 0.22)", color: "#92400e" },
      occupied: { bg: "rgba(239, 68, 68, 0.10)", border: "rgba(239, 68, 68, 0.22)", color: "#991b1b" },
      disabled: { bg: "rgba(148, 163, 184, 0.10)", border: "rgba(148, 163, 184, 0.22)", color: "#475569" },
    };
    const c = map[status] || map.available;
    return {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "999px",
      background: c.bg,
      border: `1px solid ${c.border}`,
      fontSize: "12px",
      color: c.color,
      fontWeight: 900,
    };
  },
  hint: { margin: "10px 0 0", color: "#6b7280", fontSize: "12px", fontWeight: 800 },
};

const STATUS_LABEL = {
  available: "Boş",
  reserved: "Rezerv",
  occupied: "Dolu",
  disabled: "Bağlı",
};

export default function AdminTables() {
  const [tables, setTables] = useState(() => getTables());
  const [count, setCount] = useState(() => getTables().length);

  const stats = useMemo(() => {
    const s = { available: 0, reserved: 0, occupied: 0, disabled: 0 };
    for (const t of tables) {
      if (t && typeof t.status === "string" && s[t.status] != null) s[t.status] += 1;
    }
    return s;
  }, [tables]);

  function persist(next) {
    setTables(next);
    saveTables(next);
  }

  function applyCount() {
    const next = ensureTableCount(tables, Number(count));
    persist(next);
    setCount(next.length);
  }

  function setStatus(number, status) {
    const next = tables.map((t) => (t.number === number ? { ...t, status } : t));
    persist(next);
  }

  function setAll(status) {
    const next = tables.map((t) => ({ ...t, status }));
    persist(next);
  }

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <div style={styles.panel}>
        <p style={styles.title}>Masaların sayı və statusu</p>

        <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
          <label style={styles.field}>
            Masa sayı
            <input
              style={styles.input}
              type="number"
              min={0}
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>

          <div style={styles.actions}>
            <button style={styles.button()} type="button" onClick={applyCount}>
              Tətbiq et
            </button>
            <button style={styles.button()} type="button" onClick={() => setAll("available")}>
              Hamısı boş
            </button>
            <button style={styles.button()} type="button" onClick={() => setAll("reserved")}>
              Hamısı rezerv
            </button>
            <button style={styles.button("danger")} type="button" onClick={() => setAll("occupied")}>
              Hamısı dolu
            </button>
            <button style={styles.button()} type="button" onClick={() => setAll("disabled")}>
              Hamısı bağlı
            </button>
          </div>

          <p style={styles.hint}>
            Boş: {stats.available} · Rezerv: {stats.reserved} · Dolu: {stats.occupied} · Bağlı:{" "}
            {stats.disabled}
          </p>
        </div>
      </div>

      <div style={styles.panel}>
        <p style={styles.title}>Masalar</p>
        <div style={styles.grid}>
          {tables.map((t) => (
            <div key={t.number} style={styles.card}>
              <div style={styles.cardTop}>
                <p style={styles.number}>Masa #{t.number}</p>
                <span style={styles.chip(t.status)}>{STATUS_LABEL[t.status] || t.status}</span>
              </div>

              <div style={{ marginTop: "10px", display: "grid", gap: "6px" }}>
                <span style={{ opacity: 0.75, fontSize: "12px" }}>Status</span>
                <select
                  style={styles.select}
                  value={t.status}
                  onChange={(e) => setStatus(t.number, e.target.value)}
                >
                  <option value="available">Boş</option>
                  <option value="reserved">Rezerv</option>
                  <option value="occupied">Dolu</option>
                  <option value="disabled">Bağlı</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
