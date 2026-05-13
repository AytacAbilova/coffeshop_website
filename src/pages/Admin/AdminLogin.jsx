import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminAuthed } from "./adminStorage";

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0b0f14",
    color: "#e8eef6",
    padding: "20px",
  },
  card: {
    width: "min(420px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "18px",
  },
  title: { margin: 0, fontSize: "18px", fontWeight: 700 },
  sub: { margin: "6px 0 0", opacity: 0.8, fontSize: "13px" },
  form: { marginTop: "14px", display: "grid", gap: "10px" },
  label: { display: "grid", gap: "6px", fontSize: "13px", opacity: 0.9 },
  input: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.35)",
    color: "#e8eef6",
    outline: "none",
  },
  button: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(99, 102, 241, 0.45)",
    background: "rgba(99, 102, 241, 0.25)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 700,
  },
  error: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(239, 68, 68, 0.45)",
    background: "rgba(239, 68, 68, 0.12)",
    color: "#fecaca",
    fontSize: "13px",
  },
  hint: { margin: "12px 0 0", opacity: 0.75, fontSize: "12px" },
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

