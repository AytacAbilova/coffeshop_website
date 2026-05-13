import { NavLink, Outlet } from "react-router-dom";

const baseStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4fa 100%)",
    color: "#0f172a",
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "18px",
    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  },
  brandRow: { display: "flex", alignItems: "center", gap: "10px" },
  brandDot: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: "linear-gradient(135deg, #4f46e5 0%, #22c55e 100%)",
    boxShadow: "0 10px 20px rgba(79, 70, 229, 0.22)",
  },
  brand: { margin: 0, fontSize: "16px", fontWeight: 900, letterSpacing: "0.2px" },
  nav: { marginTop: "16px", display: "grid", gap: "8px" },
  link: {
    padding: "10px 12px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#0f172a",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  linkActive: {
    background: "rgba(79, 70, 229, 0.10)",
    border: "1px solid rgba(79, 70, 229, 0.28)",
    color: "#1e1b4b",
  },
  main: { padding: "22px" },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "16px",
    padding: "14px 16px",
    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  },
  title: { margin: 0, fontSize: "15px", fontWeight: 900 },
  hint: {
    margin: 0,
    fontSize: "12px",
    color: "#4b5563",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    padding: "6px 10px",
    borderRadius: "999px",
    fontWeight: 700,
  },
};

export default function AdminLayout() {
  return (
    <div style={baseStyles.page}>
      <aside style={baseStyles.sidebar}>
        <div style={baseStyles.brandRow}>
          <span style={baseStyles.brandDot} />
          <h1 style={baseStyles.brand}>Cafe Admin</h1>
        </div>
        <nav style={baseStyles.nav}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Dashboard <span style={{ color: "#6b7280", fontWeight: 900 }}>→</span>
          </NavLink>
          <NavLink
            to="/admin/menu"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Menyu <span style={{ color: "#6b7280", fontWeight: 900 }}>→</span>
          </NavLink>
          <NavLink
            to="/admin/staff"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Ofisiantlar <span style={{ color: "#6b7280", fontWeight: 900 }}>→</span>
          </NavLink>
          <NavLink
            to="/admin/tables"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Masalar <span style={{ color: "#6b7280", fontWeight: 900 }}>→</span>
          </NavLink>
          <NavLink
            to="/admin/logout"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Çıxış <span style={{ color: "#6b7280", fontWeight: 900 }}>→</span>
          </NavLink>
        </nav>
      </aside>

      <main style={baseStyles.main}>
        <div style={baseStyles.top}>
          <p style={baseStyles.title}>Admin Panel</p>
          <p style={baseStyles.hint}>/admin</p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

