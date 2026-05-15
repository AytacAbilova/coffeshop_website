import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setAdminAuthed, setAuthTokens } from "./adminStorage";
import axios from "axios";
import { toast } from "react-toastify";
const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(160deg, #1a0f08 0%, #2c1a0e 50%, #1a0f08 100%)",
    color: "#f5e6d0",
    padding: "20px",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    position: "relative",
    overflow: "hidden",
  },
  bgPattern: {
    position: "absolute",
    inset: 0,
    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(193,134,65,0.08) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(193,134,65,0.06) 0%, transparent 50%)`,
    pointerEvents: "none",
  },
  card: {
    width: "min(420px, 100%)",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(193,134,65,0.25)",
    borderRadius: "4px",
    padding: "36px 32px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(193,134,65,0.1)",
    position: "relative",
  },
  ornament: {
    textAlign: "center",
    color: "#c18641",
    fontSize: "22px",
    letterSpacing: "8px",
    marginBottom: "16px",
    opacity: 0.7,
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: "normal",
    letterSpacing: "2px",
    color: "#f5e6d0",
    textAlign: "center",
    textTransform: "uppercase",
  },
  sub: {
    margin: "8px 0 0",
    color: "#a07850",
    fontSize: "12px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    textAlign: "center",
    fontFamily: "'Georgia', serif",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "24px 0 20px",
  },
  dividerLine: {
    flex: 1,
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(193,134,65,0.4), transparent)",
  },
  dividerDot: {
    width: "4px",
    height: "4px",
    borderRadius: "999px",
    background: "#c18641",
    opacity: 0.6,
  },
  form: { display: "grid", gap: "14px" },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "10px",
    color: "#a07850",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
  },
  input: {
    padding: "12px 14px",
    borderRadius: "2px",
    border: "1px solid rgba(193,134,65,0.2)",
    background: "rgba(255,255,255,0.04)",
    color: "#f5e6d0",
    outline: "none",
    fontSize: "14px",
    fontFamily: "'Georgia', serif",
    transition: "border-color 0.2s",
  },
  button: {
    marginTop: "6px",
    padding: "13px 12px",
    borderRadius: "2px",
    border: "1px solid rgba(193,134,65,0.5)",
    background: "linear-gradient(135deg, #c18641 0%, #a06c2a 100%)",
    color: "#1a0f08",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "11px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
    boxShadow: "0 4px 16px rgba(193,134,65,0.3)",
    transition: "opacity 0.2s",
  },
  error: {
    padding: "10px 14px",
    borderRadius: "2px",
    border: "1px solid rgba(220, 80, 60, 0.4)",
    background: "rgba(220, 80, 60, 0.08)",
    color: "#e07060",
    fontSize: "12px",
    letterSpacing: "0.5px",
    fontFamily: "'Georgia', serif",
  },
  hint: {
    margin: "20px 0 0",
    color: "#5a3e28",
    fontSize: "11px",
    letterSpacing: "1px",
    textAlign: "center",
    fontFamily: "'Georgia', serif",
  },
};

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();

    setError("");

    try {
      const res = await axios.post(
        "https://simulation2-production-7983.up.railway.app/api/Auth/login",
        {
          email: username,
          password,
        }
      );

      console.log(res.data);

      setAuthTokens({
        accessToken: res.data?.accessToken,
        refreshToken: res.data?.refreshToken,
      });
      localStorage.setItem("user", JSON.stringify(res.data));

      // admin auth
      setAdminAuthed();

      toast.success("Uğurla daxil oldunuz");

      navigate("/admin", { replace: true });
    } catch (err) {
      console.log(err);

      setError("Login məlumatları düzgün deyil.");
      toast.error("Login uğursuz oldu");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgPattern} />

      <div style={styles.card}>
        <div style={styles.ornament}>☕</div>

        <h1 style={styles.title}>Admin</h1>

        <p style={styles.sub}>Café Management</p>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <div style={styles.dividerDot} />
          <div style={styles.dividerLine} />
        </div>

        <form style={styles.form} onSubmit={onSubmit}>
          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </label>

          <label style={styles.label}>
            Şifrə
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
      </div>
    </div>
  );
}
