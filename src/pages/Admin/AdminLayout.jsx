import { NavLink, Outlet } from "react-router-dom";

const baseStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    background: "#f5ede0",
    color: "#2c1a0e",
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  sidebar: {
    background: "linear-gradient(180deg, #1a0f08 0%, #2c1a0e 100%)",
    padding: "28px 20px",
    borderRight: "1px solid rgba(193,134,65,0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "0",
  },
  brandRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(193,134,65,0.15)",
    marginBottom: "24px",
  },
  brandIcon: {
    fontSize: "28px",
    lineHeight: 1,
  },
  brand: {
    margin: 0,
    fontSize: "14px",
    fontWeight: "normal",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "#f5e6d0",
  },
  brandSub: {
    margin: 0,
    fontSize: "9px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#6b4226",
  },
  nav: { display: "grid", gap: "4px" },
  link: {
    padding: "10px 14px",
    borderRadius: "2px",
    textDecoration: "none",
    color: "#a07850",
    background: "transparent",
    border: "1px solid transparent",
    fontWeight: "normal",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "11px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    transition: "all 0.2s",
  },
  linkActive: {
    background: "rgba(193,134,65,0.10)",
    border: "1px solid rgba(193,134,65,0.25)",
    color: "#c18641",
  },
  linkArrow: {
    fontSize: "10px",
    opacity: 0.5,
  },
  sidebarFooter: {
    marginTop: "auto",
    paddingTop: "20px",
    borderTop: "1px solid rgba(193,134,65,0.10)",
    color: "#4a2e18",
    fontSize: "10px",
    letterSpacing: "1.5px",
    textAlign: "center",
    textTransform: "uppercase",
  },
  main: {
    padding: "28px",
    background: "linear-gradient(160deg, #fdf6ec 0%, #f5ede0 100%)",
  },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "22px",
    background: "#ffffff",
    border: "1px solid rgba(193,134,65,0.18)",
    borderRadius: "2px",
    padding: "16px 20px",
    boxShadow: "0 2px 20px rgba(44,26,14,0.06)",
  },
  topLeft: { display: "flex", alignItems: "center", gap: "12px" },
  topDot: {
    width: "6px",
    height: "6px",
    borderRadius: "999px",
    background: "#c18641",
  },
  title: {
    margin: 0,
    fontSize: "12px",
    fontWeight: "normal",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: "#2c1a0e",
  },
  hint: {
    margin: 0,
    fontSize: "10px",
    color: "#a07850",
    letterSpacing: "2px",
    textTransform: "uppercase",
    background: "rgba(193,134,65,0.06)",
    border: "1px solid rgba(193,134,65,0.15)",
    padding: "5px 12px",
    borderRadius: "999px",
  },
};

export default function AdminLayout() {
  return (
    <div style={baseStyles.page}>
      <aside style={baseStyles.sidebar}>
        <div style={baseStyles.brandRow}>
          <span style={baseStyles.brandIcon}>☕</span>
          <h1 style={baseStyles.brand}>Café</h1>
          <p style={baseStyles.brandSub}>Admin Panel</p>
        </div>
        <nav style={baseStyles.nav}>
          {[
            { to: "/admin", label: "Dashboard", end: true },
            { to: "/admin/menu", label: "Menyu" },
            { to: "/admin/staff", label: "Ofisiantlar" },
            { to: "/admin/tables", label: "Masalar" },
            { to: "/admin/logout", label: "Çıxış" },
          ].map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              style={({ isActive }) => ({
                ...baseStyles.link,
                ...(isActive ? baseStyles.linkActive : null),
              })}
            >
              {label}
              <span style={baseStyles.linkArrow}>›</span>
            </NavLink>
          ))}
        </nav>
        <div style={baseStyles.sidebarFooter}>Est. 2024</div>
      </aside>

      <main style={baseStyles.main}>
        <div style={baseStyles.top}>
          <div style={baseStyles.topLeft}>
            <div style={baseStyles.topDot} />
            <p style={baseStyles.title}>Admin Panel</p>
          </div>
          <p style={baseStyles.hint}>/admin</p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}