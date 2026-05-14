import { useMemo, useState } from "react";
import { getMenuItems, newMenuItem, saveMenuItems } from "./adminStorage";

const coffee = {
  gold: "#c18641",
  goldLight: "rgba(193,134,65,0.10)",
  goldBorder: "rgba(193,134,65,0.20)",
  goldBorderStrong: "rgba(193,134,65,0.35)",
  brown: "#2c1a0e",
  mid: "#6b4226",
  muted: "#a07850",
  cream: "#f5e6d0",
  white: "#ffffff",
  danger: "rgba(239,68,68,0.08)",
  dangerBorder: "rgba(239,68,68,0.30)",
  dangerText: "#991b1b",
};

const styles = {
  wrap: { display: "grid", gridTemplateColumns: "1fr", gap: "16px", fontFamily: "'Georgia', serif" },
  panel: {
    background: coffee.white,
    border: `1px solid ${coffee.goldBorder}`,
    borderRadius: "2px",
    padding: "22px 20px",
    boxShadow: "0 2px 20px rgba(44,26,14,0.06)",
  },
  sectionLabel: {
    margin: "0 0 18px",
    fontSize: "9px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: coffee.muted,
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  labelLine: {
    flex: 1,
    height: "1px",
    background: `linear-gradient(90deg, ${coffee.goldBorder}, transparent)`,
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
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    fontFamily: "'Georgia', serif",
  },
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
  chip: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "999px",
    background: coffee.goldLight,
    border: `1px solid ${coffee.goldBorder}`,
    color: coffee.mid,
    fontWeight: "normal",
    fontSize: "11px",
    letterSpacing: "1px",
  },
  empty: { color: coffee.muted, margin: "12px 0 0", fontSize: "13px" },
};

function normalizePrice(value) {
  if (value === "") return "";
  const n = Number(value);
  if (!Number.isFinite(n)) return "";
  return n;
}

export default function AdminMenu() {
  const [items, setItems] = useState(() => getMenuItems());
  const [draft, setDraft] = useState(() => newMenuItem());
  const [editingId, setEditingId] = useState(null);
  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  function persist(next) { setItems(next); saveMenuItems(next); }
  function resetForm() { setDraft(newMenuItem()); setEditingId(null); }

  function onSubmit(e) {
    e.preventDefault();
    const name = draft.name.trim();
    const category = draft.category;
    const price = normalizePrice(draft.price);
    const imageUrl = (draft.imageUrl || "").trim();
    if (!name) return;
    if (price === "" || price < 0) return;
    if (isEditing) {
      persist(items.map((it) => it.id === editingId ? { ...it, name, category, price, imageUrl } : it));
      resetForm(); return;
    }
    persist([{ ...draft, name, category, price, imageUrl }, ...items]);
    resetForm();
  }

  function onEdit(item) {
    setEditingId(item.id);
    setDraft({ id: item.id, category: item.category || "drink", name: item.name || "", price: item.price ?? "", imageUrl: item.imageUrl || "" });
  }

  function onDelete(id) {
    const ok = window.confirm("Silmək istədiyinizə əminsiniz?");
    if (!ok) return;
    persist(items.filter((it) => it.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.panel}>
        <p style={styles.title}>
          {isEditing ? "Menyu düzəlişi" : "Yeni menyu"}
          <span style={styles.labelLine} />
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          <div style={styles.row}>
            <label style={styles.field}>
              Kateqoriya
              <select style={styles.input} value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                <option value="drink">İçki</option>
                <option value="food">Yemək</option>
              </select>
            </label>
            <label style={styles.field}>
              Qiymət
              <input style={styles.input} value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} inputMode="decimal" placeholder="məs: 4.50" required />
            </label>
          </div>
          <label style={styles.field}>
            Ad
            <input style={styles.input} value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
          </label>
          <label style={styles.field}>
            Foto URL (istəyə bağlı)
            <input style={styles.input} value={draft.imageUrl} onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))} placeholder="https://..." />
          </label>
          <div style={styles.actions}>
            <button style={styles.button()} type="submit">{isEditing ? "Yadda saxla" : "Əlavə et"}</button>
            {isEditing ? <button style={styles.button("danger")} type="button" onClick={resetForm}>Ləğv et</button> : null}
          </div>
        </form>
      </div>

      <div style={styles.panel}>
        <p style={styles.title}>
          Menyu siyahısı
          <span style={styles.labelLine} />
        </p>

        {items.length === 0 ? (
          <p style={styles.empty}>Hələ item yoxdur.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "16px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {["Ad", "Kateqoriya", "Qiymət", "Foto", "Əməliyyat"].map((h) => (
                    <th key={h} style={styles.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td style={styles.td}>{it.name}</td>
                    <td style={styles.td}>
                      <span style={styles.chip}>{it.category === "food" ? "Yemək" : "İçki"}</span>
                    </td>
                    <td style={styles.td}>{Number(it.price).toFixed(2)} ₼</td>
                    <td style={styles.td}>
                      {it.imageUrl ? (
                        <a href={it.imageUrl} target="_blank" rel="noreferrer" style={{ color: coffee.gold, textDecoration: "none", fontSize: "11px", letterSpacing: "1px" }}>
                          bax →
                        </a>
                      ) : "—"}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.button()} type="button" onClick={() => onEdit(it)}>Dəyiş</button>
                        <button style={styles.button("danger")} type="button" onClick={() => onDelete(it.id)}>Sil</button>
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