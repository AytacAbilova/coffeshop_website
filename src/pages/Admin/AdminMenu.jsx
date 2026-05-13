import { useMemo, useState } from "react";
import { getMenuItems, newMenuItem, saveMenuItems } from "./adminStorage";

const styles = {
  wrap: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "14px",
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "16px",
    boxShadow: "0 10px 30px rgba(17, 24, 39, 0.06)",
  },
  title: { margin: 0, fontSize: "14px", fontWeight: 950, color: "#111827" },
  row: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
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
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  },
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
  chip: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "999px",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    color: "#374151",
    fontWeight: 800,
  },
  empty: { color: "#6b7280", margin: 0, fontSize: "13px" },
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

  function persist(next) {
    setItems(next);
    saveMenuItems(next);
  }

  function resetForm() {
    setDraft(newMenuItem());
    setEditingId(null);
  }

  function onSubmit(e) {
    e.preventDefault();

    const name = draft.name.trim();
    const category = draft.category;
    const price = normalizePrice(draft.price);
    const imageUrl = (draft.imageUrl || "").trim();

    if (!name) return;
    if (price === "" || price < 0) return;

    if (isEditing) {
      const next = items.map((it) =>
        it.id === editingId ? { ...it, name, category, price, imageUrl } : it
      );
      persist(next);
      resetForm();
      return;
    }

    const next = [{ ...draft, name, category, price, imageUrl }, ...items];
    persist(next);
    resetForm();
  }

  function onEdit(item) {
    setEditingId(item.id);
    setDraft({
      id: item.id,
      category: item.category || "drink",
      name: item.name || "",
      price: item.price ?? "",
      imageUrl: item.imageUrl || "",
    });
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
        <p style={styles.title}>{isEditing ? "Menyu düzəlişi" : "Yeni menyu"}</p>

        <form onSubmit={onSubmit} style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
          <div style={styles.row}>
            <label style={styles.field}>
              Kateqoriya
              <select
                style={styles.input}
                value={draft.category}
                onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
              >
                <option value="drink">İçki</option>
                <option value="food">Yemək</option>
              </select>
            </label>

            <label style={styles.field}>
              Qiymət
              <input
                style={styles.input}
                value={draft.price}
                onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                inputMode="decimal"
                placeholder="məs: 4.5"
                required
              />
            </label>
          </div>

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
            Foto URL (istəyə bağlı)
            <input
              style={styles.input}
              value={draft.imageUrl}
              onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
              placeholder="https://..."
            />
          </label>

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
        <p style={styles.title}>Menyu siyahısı</p>

        {items.length === 0 ? (
          <p style={{ ...styles.empty, marginTop: "10px" }}>Hələ item yoxdur.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "10px" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ad</th>
                  <th style={styles.th}>Kateqoriya</th>
                  <th style={styles.th}>Qiymət</th>
                  <th style={styles.th}>Foto</th>
                  <th style={styles.th}>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr key={it.id}>
                    <td style={styles.td}>{it.name}</td>
                    <td style={styles.td}>
                      <span style={styles.chip}>
                        {it.category === "food" ? "Yemək" : "İçki"}
                      </span>
                    </td>
                    <td style={styles.td}>{Number(it.price).toFixed(2)}</td>
                    <td style={styles.td}>
                      {it.imageUrl ? (
                        <a
                          href={it.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#4f46e5", fontWeight: 900, textDecoration: "none" }}
                        >
                          link
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={styles.button()}
                          type="button"
                          onClick={() => onEdit(it)}
                        >
                          Dəyiş
                        </button>
                        <button
                          style={styles.button("danger")}
                          type="button"
                          onClick={() => onDelete(it.id)}
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
