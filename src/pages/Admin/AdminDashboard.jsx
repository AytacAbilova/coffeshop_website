import { useMemo } from "react";
import { getMenuItems, getStaff, getTables } from "./adminStorage";

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "14px",
  },
  title: { margin: 0, opacity: 0.8, fontSize: "13px" },
  value: { margin: "6px 0 0", fontSize: "26px", fontWeight: 800 },
  sectionTitle: { margin: "18px 0 10px", fontSize: "14px", fontWeight: 700 },
  list: { margin: 0, paddingLeft: "18px", opacity: 0.85 },
};

export default function AdminDashboard() {
  const summary = useMemo(() => {
    const menu = getMenuItems();
    const staff = getStaff();
    const tables = getTables();

    const stats = { available: 0, reserved: 0, occupied: 0, disabled: 0 };
    for (const t of tables) {
      if (t && typeof t.status === "string" && stats[t.status] != null) {
        stats[t.status] += 1;
      }
    }

    return {
      menuCount: menu.length,
      staffCount: staff.length,
      tableCount: tables.length,
      tableSummary: [
        `Boş: ${stats.available}`,
        `Rezerv: ${stats.reserved}`,
        `Dolu: ${stats.occupied}`,
        `Bağlı: ${stats.disabled}`,
      ],
    };
  }, []);

  return (
    <div>
      <div style={styles.grid}>
        <div style={styles.card}>
          <p style={styles.title}>Menyu itemləri</p>
          <p style={styles.value}>{summary.menuCount}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.title}>Ofisiantlar</p>
          <p style={styles.value}>{summary.staffCount}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.title}>Masalar</p>
          <p style={styles.value}>{summary.tableCount}</p>
        </div>
      </div>

      <h2 style={styles.sectionTitle}>Qısa baxış</h2>
      <ul style={styles.list}>
        {summary.tableSummary.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}
