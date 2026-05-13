import { NavLink, Outlet } from "react-router-dom";

const baseStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "#0b0f14",
    color: "#e8eef6",
  },
  sidebar: {
    borderRight: "1px solid rgba(255,255,255,0.08)",
    padding: "20px",
  },
  brand: { margin: 0, fontSize: "18px", letterSpacing: "0.6px" },
  nav: { marginTop: "18px", display: "grid", gap: "8px" },
  link: {
    padding: "10px 12px",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#cfe0f3",
    background: "rgba(255,255,255,0.04)",
  },
  linkActive: {
    background: "rgba(99, 102, 241, 0.25)",
    color: "#ffffff",
  },
  main: { padding: "22px" },
  top: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  title: { margin: 0, fontSize: "16px", fontWeight: 600 },
  hint: { margin: 0, opacity: 0.75, fontSize: "13px" },
};

export default function AdminLayout() {
  return (
    <div style={baseStyles.page}>
      <aside style={baseStyles.sidebar}>
        <h1 style={baseStyles.brand}>Cafe Admin</h1>
        <nav style={baseStyles.nav}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/menu"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Menyu
          </NavLink>
          <NavLink
            to="/admin/staff"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Ofisiantlar
          </NavLink>
          <NavLink
            to="/admin/tables"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Masalar
          </NavLink>
          <NavLink
            to="/admin/logout"
            style={({ isActive }) => ({
              ...baseStyles.link,
              ...(isActive ? baseStyles.linkActive : null),
            })}
          >
            Çıxış
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

