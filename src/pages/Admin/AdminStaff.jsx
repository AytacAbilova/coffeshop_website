import { useMemo, useState } from "react";
import { getStaff, newStaffMember, saveStaff } from "./adminStorage";

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
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
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
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px", fontFamily: "'Georgia', serif" },
  th: {
    textAlign: "left",
    color: coffee.muted,
    padding: "10px 10px",
    borderBottom: `1px solid ${coffee.goldBorder}`,
    fontWeight: "normal",
    fontSize: "9px",
    letterSpacing: "2.5px",
    textTransform: "uppercase",
  },
  td: {
    padding: "12px 10px",
    borderBottom: `1px solid rgba(193,134,65,0.08)`,
    verticalAlign: "middle",
    color: coffee.brown,
  },
  chip: (active) => ({
    display: "inline-block",
    padding: "3px 12px",
    borderRadius: "999px",
    background: active ? "rgba(34,197,94,0.08)" : "rgba(148,163,184,0.10)",
    border: `1px solid ${active ? "rgba(34,197,94,0.22)" : "rgba(148,163,184,0.22)"}`,
    color: active ? "#065f46" : "#475569",
    fontWeight: "normal",
    fontSize: "11px",
    letterSpacing: "1px",
  }),
  empty: { color: coffee.muted, margin: "12px 0 0", fontSize: "13px" },
};

export default function AdminStaff() {
  const [staff, setStaff] = useState(() => getStaff());
  const [draft, setDraft] = useState(() => newStaffMember());
  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  function persist(next) { setStaff(next); saveStaff(next); }
  function resetForm() { setDraft(newStaffMember()); setEditingId(null); }

  function onSubmit(e) {
    e.preventDefault();
    const name = draft.name.trim();
    const phone = (draft.phone || "").trim();
    if (!name) return;
    if (isEditing) {
      persist(staff.map((s) => s.id === editingId ? { ...s, name, phone } : s));
      resetForm(); return;
    }
    persist([{ ...draft, name, phone, active: true }, ...staff]);
    resetForm();
  }

  function onEdit(member) {
    setEditingId(member.id);
    setDraft({ id: member.id, name: member.name || "", phone: member.phone || "", active: Boolean(member.active) });
  }

  function onDelete(id) {
    const ok = window.confirm("Silmək istədiyinizə əminsiniz?");
    if (!ok) return;
    persist(staff.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  }

  function toggleActive(id) {
    persist(staff.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  }

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={styles.panel}>
        <p style={styles.title}>
          {isEditing ? "Ofisiant düzəlişi" : "Yeni ofisiant"}
          <span style={styles.labelLine} />
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={styles.grid}>
            <label style={styles.field}>
              Ad
              <input style={styles.input} value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
            </label>
            <label style={styles.field}>
              Telefon (istəyə bağlı)
              <input style={styles.input} value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} placeholder="+994..." />
            </label>
          </div>
          <div style={styles.actions}>
            <button style={styles.button()} type="submit">{isEditing ? "Yadda saxla" : "Əlavə et"}</button>
            {isEditing ? <button style={styles.button("danger")} type="button" onClick={resetForm}>Ləğv et</button> : null}
          </div>
        </form>
      </div>

      <div style={styles.panel}>
        <p style={styles.title}>
          Ofisiant siyahısı
          <span style={styles.labelLine} />
        </p>

        {staff.length === 0 ? (
          <p style={styles.empty}>Hələ ofisiant yoxdur.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "16px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Ad", "Telefon", "Status", "Əməliyyat"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.phone || "—"}</td>
                    <td style={styles.td}>
                      <span style={styles.chip(Boolean(s.active))}>{s.active ? "Aktiv" : "Deaktiv"}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.button()} type="button" onClick={() => toggleActive(s.id)}>Status</button>
                        <button style={styles.button()} type="button" onClick={() => onEdit(s)}>Dəyiş</button>
                        <button style={styles.button("danger")} type="button" onClick={() => onDelete(s.id)}>Sil</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}