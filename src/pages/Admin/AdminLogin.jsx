import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminAuthed } from "./adminStorage";

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(180deg, #f7f8fc 0%, #f2f4fa 100%)",
    color: "#0f172a",
    padding: "20px",
  },
  card: {
    width: "min(420px, 100%)",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 16px 40px rgba(17, 24, 39, 0.10)",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 900 },
  sub: { margin: "6px 0 0", color: "#6b7280", fontSize: "13px" },
  form: { marginTop: "14px", display: "grid", gap: "10px" },
  label: { display: "grid", gap: "6px", fontSize: "13px", color: "#374151" },
  input: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
  },
  button: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(79, 70, 229, 0.35)",
    background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 900,
    boxShadow: "0 12px 24px rgba(79, 70, 229, 0.18)",
  },
  error: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(239, 68, 68, 0.35)",
    background: "rgba(239, 68, 68, 0.08)",
    color: "#991b1b",
    fontSize: "13px",
  },
  hint: { margin: "12px 0 0", color: "#6b7280", fontSize: "12px" },
};

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validCredentials = useMemo(
    () => ({ username: "admin", password: "admin123" }),
    []
  );

  function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      username.trim() !== validCredentials.username ||
      password !== validCredentials.password
    ) {
      setError("Login düzgün deyil.");
      return;
    }

    setAdminAuthed();
    navigate("/admin", { replace: true });
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.sub}>Admin panelə giriş edin.</p>

        <form style={styles.form} onSubmit={onSubmit}>
          <label style={styles.label}>
            Username
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </label>

          {error ? <div style={styles.error}>{error}</div> : null}

          <button style={styles.button} type="submit">
            Daxil ol
          </button>
        </form>

        <p style={styles.hint}>Default: admin / admin123</p>
      </div>
    </div>
  );
}

