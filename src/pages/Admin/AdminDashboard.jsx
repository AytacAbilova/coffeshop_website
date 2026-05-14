import { useMemo } from "react";
import { getMenuItems, getStaff, getTables } from "./adminStorage";

const coffee = {
  dark: "#1a0f08",
  brown: "#2c1a0e",
  mid: "#6b4226",
  gold: "#c18641",
  goldLight: "rgba(193,134,65,0.12)",
  goldBorder: "rgba(193,134,65,0.20)",
  cream: "#f5e6d0",
  text: "#3a2010",
  muted: "#a07850",
  bg: "#fdf6ec",
  white: "#ffffff",
};

const styles = {
  sectionLabel: {
    margin: "0 0 16px",
    fontSize: "9px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: coffee.muted,
    fontFamily: "'Georgia', serif",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  labelLine: {
    flex: 1,
    height: "1px",
    background: `linear-gradient(90deg, ${coffee.goldBorder}, transparent)`,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "12px",
    marginBottom: "28px",
  },
  card: {
    background: coffee.white,
    border: `1px solid ${coffee.goldBorder}`,
    borderRadius: "2px",
    padding: "22px 20px",
    boxShadow: "0 2px 20px rgba(44,26,14,0.06)",
    position: "relative",
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "3px",
    height: "100%",
    background: `linear-gradient(180deg, ${coffee.gold}, transparent)`,
  },
  cardTitle: {
    margin: 0,
    fontSize: "9px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: coffee.muted,
    fontFamily: "'Georgia', serif",
  },
  cardValue: {
    margin: "10px 0 0",
    fontSize: "36px",
    fontWeight: "normal",
    color: coffee.brown,
    fontFamily: "'Georgia', serif",
    lineHeight: 1,
  },
  cardIcon: {
    position: "absolute",
    bottom: "14px",
    right: "16px",
    fontSize: "24px",
    opacity: 0.08,
  },
  summaryCard: {
    background: coffee.white,
    border: `1px solid ${coffee.goldBorder}`,
    borderRadius: "2px",
    padding: "20px 22px",
    boxShadow: "0 2px 20px rgba(44,26,14,0.06)",
  },
  summaryTitle: {
    margin: "0 0 14px",
    fontSize: "9px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: coffee.muted,
    fontFamily: "'Georgia', serif",
  },
  statRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: `1px solid rgba(193,134,65,0.08)`,
    fontFamily: "'Georgia', serif",
  },
  statLabel: {
    fontSize: "12px",
    color: coffee.mid,
    letterSpacing: "0.5px",
  },
  statBadge: (color) => ({
    padding: "3px 12px",
    borderRadius: "999px",
    fontSize: "11px",
    fontFamily: "'Georgia', serif",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    background: color.bg,
    border: `1px solid ${color.border}`,
    color: color.text,
  }),
};

const statusColors = {
  "Boş": { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", text: "#065f46" },
  "Rezerv": { bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.2)", text: "#92400e" },
  "Dolu": { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#991b1b" },
  "Bağlı": { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.2)", text: "#475569" },
};

export default function AdminDashboard() {
  const summary = useMemo(() => {
    const menu = getMenuItems();
    const staff = getStaff();
    const tables = getTables();
    const stats = { available: 0, reserved: 0, occupied: 0, disabled: 0 };
    for (const t of tables) {
      if (t && typeof t.status === "string" && stats[t.status] != null) stats[t.status] += 1;
    }
    return {
      menuCount: menu.length,
      staffCount: staff.length,
      tableCount: tables.length,
      tableSummary: [
        { label: "Boş", value: stats.available },
        { label: "Rezerv", value: stats.reserved },
        { label: "Dolu", value: stats.occupied },
        { label: "Bağlı", value: stats.disabled },
      ],
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Georgia', serif" }}>
      <div style={styles.sectionLabel}>
        Ümumi baxış
        <div style={styles.labelLine} />
      </div>

      <div style={styles.grid}>
        {[
          { label: "Menyu itemləri", value: summary.menuCount, icon: "🍽" },
          { label: "Ofisiantlar", value: summary.staffCount, icon: "👤" },
          { label: "Masalar", value: summary.tableCount, icon: "🪑" },
        ].map(({ label, value, icon }) => (
          <div key={label} style={styles.card}>
            <div style={styles.cardAccent} />
            <p style={styles.cardTitle}>{label}</p>
            <p style={styles.cardValue}>{value}</p>
            <span style={styles.cardIcon}>{icon}</span>
          </div>
        ))}
      </div>

      <div style={styles.sectionLabel}>
        Masa statusları
        <div style={styles.labelLine} />
      </div>

      <div style={styles.summaryCard}>
        <p style={styles.summaryTitle}>Cari vəziyyət</p>
        {summary.tableSummary.map(({ label, value }, i) => (
          <div
            key={label}
            style={{
              ...styles.statRow,
              ...(i === summary.tableSummary.length - 1 ? { borderBottom: "none" } : {}),
            }}
          >
            <span style={styles.statLabel}>{label}</span>
            <span style={styles.statBadge(statusColors[label] || statusColors["Bağlı"])}>
              {value} masa
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}