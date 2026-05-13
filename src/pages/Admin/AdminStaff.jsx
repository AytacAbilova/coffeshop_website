import { useMemo, useState } from "react";
import { getStaff, newStaffMember, saveStaff } from "./adminStorage";

const styles = {
  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  },
  title: { margin: 0, fontSize: "14px", fontWeight: 950, color: "#111827" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  field: { display: "grid", gap: "6px", fontSize: "13px", color: "#374151" },
  input: {
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    outline: "none",
  },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  button: (variant) => ({
    padding: "10px 12px",
    borderRadius: "12px",
    border:
      variant === "danger"
        ? "1px solid rgba(239, 68, 68, 0.35)"
        : "1px solid rgba(79, 70, 229, 0.28)",
    background:
      variant === "danger"
        ? "rgba(239, 68, 68, 0.08)"
        : "rgba(79, 70, 229, 0.10)",
    color: variant === "danger" ? "#991b1b" : "#1e1b4b",
    cursor: "pointer",
    fontWeight: 900,
  }),
  table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
  th: {
    textAlign: "left",
    color: "#6b7280",
    padding: "10px 8px",
    borderBottom: "1px solid #e5e7eb",
    fontWeight: 900,
  },
  td: {
    padding: "10px 8px",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "top",
    color: "#111827",
  },
  chip: (active) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: active ? "rgba(34, 197, 94, 0.10)" : "rgba(148, 163, 184, 0.10)",
    border: `1px solid ${
      active ? "rgba(34, 197, 94, 0.24)" : "rgba(148, 163, 184, 0.22)"
    }`,
    color: active ? "#065f46" : "#475569",
    fontWeight: 900,
  }),
  empty: { color: "#6b7280", margin: 0, fontSize: "13px" },
};

export default function AdminStaff() {
  const [staff, setStaff] = useState(() => getStaff());
  const [draft, setDraft] = useState(() => newStaffMember());
  const [editingId, setEditingId] = useState(null);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  function persist(next) {
    setStaff(next);
    saveStaff(next);
  }

  function resetForm() {
    setDraft(newStaffMember());
    setEditingId(null);
  }

  function onSubmit(e) {
    e.preventDefault();
    const name = draft.name.trim();
    const phone = (draft.phone || "").trim();
    if (!name) return;

    if (isEditing) {
      const next = staff.map((s) =>
        s.id === editingId ? { ...s, name, phone } : s
      );
      persist(next);
      resetForm();
      return;
    }

    const next = [{ ...draft, name, phone, active: true }, ...staff];
    persist(next);
    resetForm();
  }

  function onEdit(member) {
    setEditingId(member.id);
    setDraft({
      id: member.id,
      name: member.name || "",
      phone: member.phone || "",
      active: Boolean(member.active),
    });
  }

  function onDelete(id) {
    const ok = window.confirm("Silmək istədiyinizə əminsiniz?");
    if (!ok) return;
    persist(staff.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  }

  function toggleActive(id) {
    const next = staff.map((s) =>
      s.id === id ? { ...s, active: !s.active } : s
    );
    persist(next);
  }

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <div style={styles.panel}>
        <p style={styles.title}>{isEditing ? "Ofisiant düzəlişi" : "Yeni ofisiant"}</p>

        <form onSubmit={onSubmit} style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
          <div style={styles.grid}>
            <label style={styles.field}>
              Ad
              <input
                style={styles.input}
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                required
              />
            </label>
            <label style={styles.field}>
              Telefon (istəyə bağlı)
              <input
                style={styles.input}
                value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                placeholder="+994..."
              />
            </label>
          </div>

          <div style={styles.actions}>
            <button style={styles.button()} type="submit">
              {isEditing ? "Yadda saxla" : "Əlavə et"}
            </button>
            {isEditing ? (
              <button
                style={styles.button("danger")}
                type="button"
                onClick={resetForm}
              >
                Ləğv et
              </button>
            ) : null}
          </div>
        </form>
      </div>

      <div style={styles.panel}>
        <p style={styles.title}>Ofisiant siyahısı</p>

        {staff.length === 0 ? (
          <p style={{ ...styles.empty, marginTop: "10px" }}>Hələ ofisiant yoxdur.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "10px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ad</th>
                  <th style={styles.th}>Telefon</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((s) => (
                  <tr key={s.id}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.phone || "-"}</td>
                    <td style={styles.td}>
                      <span style={styles.chip(Boolean(s.active))}>
                        {s.active ? "Aktiv" : "Deaktiv"}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={styles.button()}
                          type="button"
                          onClick={() => toggleActive(s.id)}
                        >
                          Status
                        </button>
                        <button
                          style={styles.button()}
                          type="button"
                          onClick={() => onEdit(s)}
                        >
                          Dəyiş
                        </button>
                        <button
                          style={styles.button("danger")}
                          type="button"
                          onClick={() => onDelete(s.id)}
                        >
                          Sil
                        </button>
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
