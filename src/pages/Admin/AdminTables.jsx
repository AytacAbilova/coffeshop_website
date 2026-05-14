import { useMemo, useState } from "react";
import { ensureTableCount, getTables, saveTables } from "./adminStorage";

const coffee = {
  gold: "#c18641",
  goldLight: "rgba(193,134,65,0.10)",
  goldBorder: "rgba(193,134,65,0.20)",
  goldBorderStrong: "rgba(193,134,65,0.35)",
  brown: "#2c1a0e",
  mid: "#6b4226",
  muted: "#a07850",
  white: "#ffffff",
  danger: "rgba(239,68,68,0.08)",
  dangerBorder: "rgba(239,68,68,0.30)",
  dangerText: "#991b1b",
};

const STATUS_LABEL = {
  available: "Boş",
  reserved: "Rezerv",
  occupied: "Dolu",
  disabled: "Bağlı",
};

const STATUS_STYLE = {
  available: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.22)", color: "#065f46" },
  reserved: { bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.22)", color: "#92400e" },
  occupied: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.22)", color: "#991b1b" },
  disabled: { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)", color: "#475569" },
};

const styles = {
  panel: {
    background: coffee.white,
    border: `1px solid ${coffee.goldBorder}`,
    borderRadius: "2px",
    padding: "22px 20px",
    boxShadow: "0 2px 20px rgba(44,26,14,0.06)",
    fontFamily: "'Georgia', serif",
  },
  title: {
    margin: 0,
    fontSize: "9px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: coffee.muted,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  labelLine: {
    flex: 1,
    height: "1px",
    background: `linear-gradient(90deg, ${coffee.goldBorder}, transparent)`,
  },
  field: {
    display: "grid",
    gap: "6px",
    fontSize: "9px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: coffee.muted,
  },
  input: {
    padding: "10px 13px",
    borderRadius: "2px",
    border: `1px solid ${coffee.goldBorder}`,
    background: "#fdf8f3",
    color: coffee.brown,
    outline: "none",
    fontSize: "13px",
    fontFamily: "'Georgia', serif",
    maxWidth: "160px",
  },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  button: (variant) => ({
    padding: "10px 18px",
    borderRadius: "2px",
    border: variant === "danger" ? `1px solid ${coffee.dangerBorder}` : `1px solid ${coffee.goldBorderStrong}`,
    background: variant === "danger" ? coffee.danger : coffee.goldLight,
    color: variant === "danger" ? coffee.dangerText : coffee.mid,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
  }),
  hint: {
    margin: "14px 0 0",
    color: coffee.muted,
    fontSize: "11px",
    letterSpacing: "1.5px",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  hintDot: (status) => ({
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "999px",
    background: STATUS_STYLE[status].color,
    marginRight: "5px",
    verticalAlign: "middle",
  }),
  grid: {
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "10px",
  },
  card: {
    padding: "14px",
    borderRadius: "2px",
    border: `1px solid ${coffee.goldBorder}`,
    background: "linear-gradient(160deg, #fdf8f3 0%, #fff9f5 100%)",
    boxShadow: "0 2px 12px rgba(44,26,14,0.05)",
    fontFamily: "'Georgia', serif",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "12px",
  },
  number: {
    margin: 0,
    fontWeight: "normal",
    color: coffee.brown,
    fontSize: "13px",
    letterSpacing: "1px",
  },
  chip: (status) => {
    const s = STATUS_STYLE[status] || STATUS_STYLE.available;
    return {
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      background: s.bg,
      border: `1px solid ${s.border}`,
      fontSize: "10px",
      color: s.color,
      letterSpacing: "1px",
    };
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "2px",
    border: `1px solid ${coffee.goldBorder}`,
    background: "#fdf8f3",
    color: coffee.brown,
    outline: "none",
    fontSize: "12px",
    fontFamily: "'Georgia', serif",
  },
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

  function persist(next) { setTables(next); saveTables(next); }

  function applyCount() {
    const next = ensureTableCount(tables, Number(count));
    persist(next);
    setCount(next.length);
  }

  function setStatus(number, status) {
    persist(tables.map((t) => (t.number === number ? { ...t, status } : t)));
  }

  function setAll(status) {
    persist(tables.map((t) => ({ ...t, status })));
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={styles.panel}>
        <p style={styles.title}>
          Masa idarəetməsi
          <span style={styles.labelLine} />
        </p>

        <div style={{ marginTop: "18px", display: "grid", gap: "14px" }}>
          <label style={styles.field}>
            Masa sayı
            <input style={styles.input} type="number" min={0} value={count} onChange={(e) => setCount(e.target.value)} />
          </label>

          <div style={styles.actions}>
            <button style={styles.button()} type="button" onClick={applyCount}>Tətbiq et</button>
            <button style={styles.button()} type="button" onClick={() => setAll("available")}>Hamısı boş</button>
            <button style={styles.button()} type="button" onClick={() => setAll("reserved")}>Hamısı rezerv</button>
            <button style={styles.button("danger")} type="button" onClick={() => setAll("occupied")}>Hamısı dolu</button>
            <button style={styles.button()} type="button" onClick={() => setAll("disabled")}>Hamısı bağlı</button>
          </div>

          <div style={styles.hint}>
            {Object.entries(stats).map(([key, val]) => (
              <span key={key}>
                <span style={styles.hintDot(key)} />
                {STATUS_LABEL[key]}: {val}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.panel}>
        <p style={styles.title}>
          Masalar
          <span style={styles.labelLine} />
        </p>
        <div style={styles.grid}>
          {tables.map((t) => (
            <div key={t.number} style={styles.card}>
              <div style={styles.cardTop}>
                <p style={styles.number}>Masa #{t.number}</p>
                <span style={styles.chip(t.status)}>{STATUS_LABEL[t.status] || t.status}</span>
              </div>
              <select style={styles.select} value={t.status} onChange={(e) => setStatus(t.number, e.target.value)}>
                <option value="available">Boş</option>
                <option value="reserved">Rezerv</option>
                <option value="occupied">Dolu</option>
                <option value="disabled">Bağlı</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}