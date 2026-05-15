import { useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { saveTables } from "./adminStorage";

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

const STATUS_LABEL = {
  available: "Boş",
  reserved: "Rezerv",
  occupied: "Dolu",
  disabled: "Bağlı",
};

const STATUS_STYLE = {
  available: { bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.22)", color: "#065f46" },
  reserved: { bg: "rgba(234,179,8,0.10)", border: "rgba(234,179,8,0.22)", color: "#92400e" },
  occupied: { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.22)", color: "#991b1b" },
  disabled: { bg: "rgba(148,163,184,0.10)", border: "rgba(148,163,184,0.22)", color: "#475569" },
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
  subTitle: {
    margin: "18px 0 10px",
    fontSize: "9px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: coffee.muted,
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
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
  buttonPrimary: {
    padding: "10px 18px",
    borderRadius: "2px",
    border: `1px solid ${coffee.goldBorderStrong}`,
    background: `linear-gradient(135deg, rgba(193,134,65,0.18) 0%, rgba(193,134,65,0.08) 100%)`,
    color: coffee.brown,
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontFamily: "'Georgia', serif",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "12px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "12px",
  },
  hint: {
    margin: "14px 0 0",
    color: coffee.muted,
    fontSize: "11px",
    letterSpacing: "1.5px",
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  hintDot: (status) => ({
    display: "inline-block",
    width: "6px",
    height: "6px",
    borderRadius: "999px",
    background: STATUS_STYLE[status].color,
    marginRight: "5px",
    verticalAlign: "middle",
  }),
  grid: {
    marginTop: "16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "10px",
  },
  card: {
    padding: "14px",
    borderRadius: "2px",
    border: `1px solid ${coffee.goldBorder}`,
    background: "linear-gradient(160deg, #fdf8f3 0%, #fff9f5 100%)",
    boxShadow: "0 2px 12px rgba(44,26,14,0.05)",
    fontFamily: "'Georgia', serif",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "12px",
  },
  number: {
    margin: 0,
    fontWeight: "normal",
    color: coffee.brown,
    fontSize: "13px",
    letterSpacing: "1px",
  },
  meta: { margin: "0 0 12px", color: coffee.muted, fontSize: "12px" },
  chip: (status) => {
    const s = STATUS_STYLE[status] || STATUS_STYLE.available;
    return {
      display: "inline-block",
      padding: "2px 10px",
      borderRadius: "999px",
      background: s.bg,
      border: `1px solid ${s.border}`,
      fontSize: "10px",
      color: s.color,
      letterSpacing: "1px",
    };
  },
  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "2px",
    border: `1px solid ${coffee.goldBorder}`,
    background: "#fdf8f3",
    color: coffee.brown,
    outline: "none",
    fontSize: "12px",
    fontFamily: "'Georgia', serif",
  },
  cardActions: {
    marginTop: "10px",
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  errorBox: {
    marginTop: "14px",
    padding: "10px 14px",
    borderRadius: "2px",
    border: "1px solid rgba(220, 80, 60, 0.35)",
    background: "rgba(220, 80, 60, 0.08)",
    color: "#b45309",
    fontSize: "12px",
    letterSpacing: "0.5px",
  },
};
const API_URL = "https://simulation2-production-7983.up.railway.app/api/Tables";
export default function AdminTables() {
  const loaderData = useLoaderData();
  const [tables, setTables] = useState(() => {
    const raw = Array.isArray(loaderData) ? loaderData : [];
    const next = raw.map((t) => {
      const id = t?.id ?? t?.tableId ?? t?.tableID ?? t?.number ?? "";
      const number = Number(t?.number);
      const capacity = Number(t?.capacity ?? t?.seats ?? 4);
      const status =
        typeof t?.status === "string"
          ? t.status
          : t?.isAvailable === true
            ? "available"
            : "reserved";

      return {
        id,
        number: Number.isFinite(number) ? number : 0,
        capacity: Number.isFinite(capacity) ? capacity : 0,
        status,
      };
    });
    saveTables(next);
    return next;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [createDraft, setCreateDraft] = useState({
    number: "",
    capacity: "",
    status: "available",
  });
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({
    number: "",
    capacity: "",
    status: "available",
  });

  function normalizeTable(t) {
    const id = t?.id ?? t?.tableId ?? t?.tableID ?? t?.number ?? "";
    const number = Number(t?.number);
    const capacity = Number(t?.capacity ?? t?.seats ?? 4);
    const status =
      typeof t?.status === "string"
        ? t.status
        : t?.isAvailable === true
          ? "available"
          : "reserved";

    return {
      id,
      number: Number.isFinite(number) ? number : 0,
      capacity: Number.isFinite(capacity) ? capacity : 0,
      status,
    };
  }

  async function fetchTables() {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const next = Array.isArray(res.data) ? res.data.map(normalizeTable) : [];
      setTables(next);
      saveTables(next);
    } catch (e) {
      setError("Masaları yükləmək mümkün olmadı.");
      console.log(e?.response?.data || e);
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(e) {
    e.preventDefault();
    setError("");

    const number = Number(createDraft.number);
    const capacity = Number(createDraft.capacity);
    const status = createDraft.status;

    if (!Number.isFinite(number) || number < 1) return;
    if (!Number.isFinite(capacity) || capacity < 1) return;

    try {
      await axios.post(API_URL, { number, capacity, status });
      toast.success("Masa əlavə olundu");
      setCreateDraft({ number: "", capacity: "", status: "available" });
      await fetchTables();
    } catch (e) {
      console.log(e?.response?.data || e);
      toast.error("Masa əlavə etmək mümkün olmadı");
    }
  }

  function startEdit(t) {
    setEditingId(t.id);
    setEditDraft({
      number: String(t.number || ""),
      capacity: String(t.capacity || ""),
      status: t.status || "available",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft({ number: "", capacity: "", status: "available" });
  }

  async function saveEdit(id) {
    const number = Number(editDraft.number);
    const capacity = Number(editDraft.capacity);
    const status = editDraft.status;
    if (!Number.isFinite(number) || number < 1) return;
    if (!Number.isFinite(capacity) || capacity < 1) return;

    try {
      await axios.put(`${API_URL}/${id}`, { id, number, capacity, status });
      toast.success("Masa yeniləndi");
      cancelEdit();
      await fetchTables();
    } catch (e) {
      console.log(e?.response?.data || e);
      toast.error("Yeniləmək mümkün olmadı");
    }
  }

  async function changeStatus(id, status) {
    const current = tables.find((t) => t.id === id);
    if (!current) return;

    const optimistic = tables.map((t) => (t.id === id ? { ...t, status } : t));
    setTables(optimistic);
    saveTables(optimistic);

    try {
      await axios.put(`${API_URL}/${id}`, {
        id,
        number: Number(current.number),
        capacity: Number(current.capacity),
        status,
      });
    } catch (e) {
      console.log(e?.response?.data || e);
      toast.error("Status yenilənmədi");
      await fetchTables();
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Bu masanı silmək istədiyinizə əminsiniz?");
    if (!ok) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      toast.success("Masa silindi");
      const next = tables.filter((t) => t.id !== id);
      setTables(next);
      saveTables(next);
      if (editingId === id) cancelEdit();
    } catch (e) {
      console.log(e?.response?.data || e);
      toast.error("Silmək mümkün olmadı");
    }
  }
  const stats = useMemo(() => {
    const s = { available: 0, reserved: 0, occupied: 0, disabled: 0 };
    for (const t of tables) {
      if (t && typeof t.status === "string" && s[t.status] != null) s[t.status] += 1;
    }
    return s;
  }, [tables]);

  return (
    <div style={{ display: "grid", gap: "16px" }}>
      <div style={styles.panel}>
        <p style={styles.title}>
          Masa idarəetməsi
          <span style={styles.labelLine} />
        </p>
        <div style={styles.toolbar}>
          <div style={styles.hint}>
            {Object.entries(stats).map(([key, val]) => (
              <span key={key}>
                <span style={styles.hintDot(key)} />
                {STATUS_LABEL[key]}: {val}
              </span>
            ))}
          </div>

          <div style={styles.actions}>
            <button style={styles.buttonPrimary} type="button" onClick={fetchTables}>
              {loading ? "Yüklənir..." : "Yenilə"}
            </button>
          </div>
        </div>

        <p style={styles.subTitle}>
          Yeni masa
          <span style={styles.labelLine} />
        </p>

        <form onSubmit={onCreate} style={{ display: "grid", gap: "12px" }}>
          <div style={styles.grid2}>
            <label style={styles.field}>
              Nömrə
              <input
                style={styles.input}
                type="number"
                min={1}
                value={createDraft.number}
                onChange={(e) => setCreateDraft((d) => ({ ...d, number: e.target.value }))}
                required
              />
            </label>
            <label style={styles.field}>
              Tutum
              <input
                style={styles.input}
                type="number"
                min={1}
                value={createDraft.capacity}
                onChange={(e) => setCreateDraft((d) => ({ ...d, capacity: e.target.value }))}
                required
              />
            </label>
            <label style={styles.field}>
              Status
              <select
                style={styles.select}
                value={createDraft.status}
                onChange={(e) => setCreateDraft((d) => ({ ...d, status: e.target.value }))}
              >
                <option value="available">Boş</option>
                <option value="reserved">Rezerv</option>
                <option value="occupied">Dolu</option>
                <option value="disabled">Bağlı</option>
              </select>
            </label>
          </div>

          <div style={styles.actions}>
            <button style={styles.button()} type="submit">
              Əlavə et
            </button>
          </div>
        </form>

        {error ? <div style={styles.errorBox}>{error}</div> : null}
      </div>

      <div style={styles.panel}>
        <p style={styles.title}>
          Masalar
          <span style={styles.labelLine} />
        </p>
        <div style={styles.grid}>
          {tables.map((t) => (
            <div key={t.id} style={styles.card}>
              <div style={styles.cardTop}>
                <p style={styles.number}>Masa #{t.number}</p>
                <span style={styles.chip(t.status)}>{STATUS_LABEL[t.status] || t.status}</span>
              </div>
              <p style={styles.meta}>Tutum: {t.capacity || "-"}</p>

              {editingId === t.id ? (
                <>
                  <label style={styles.field}>
                    Nömrə
                    <input
                      style={styles.input}
                      type="number"
                      min={1}
                      value={editDraft.number}
                      onChange={(e) => setEditDraft((d) => ({ ...d, number: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={styles.field}>
                    Tutum
                    <input
                      style={styles.input}
                      type="number"
                      min={1}
                      value={editDraft.capacity}
                      onChange={(e) => setEditDraft((d) => ({ ...d, capacity: e.target.value }))}
                      required
                    />
                  </label>
                  <label style={styles.field}>
                    Status
                    <select
                      style={styles.select}
                      value={editDraft.status}
                      onChange={(e) => setEditDraft((d) => ({ ...d, status: e.target.value }))}
                    >
                      <option value="available">Boş</option>
                      <option value="reserved">Rezerv</option>
                      <option value="occupied">Dolu</option>
                      <option value="disabled">Bağlı</option>
                    </select>
                  </label>

                  <div style={styles.cardActions}>
                    <button style={styles.button()} type="button" onClick={() => saveEdit(t.id)}>
                      Yadda saxla
                    </button>
                    <button style={styles.button("danger")} type="button" onClick={cancelEdit}>
                      Ləğv et
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <label style={styles.field}>
                    Status
                    <select
                      style={styles.select}
                      value={t.status}
                      onChange={(e) => changeStatus(t.id, e.target.value)}
                    >
                      <option value="available">Boş</option>
                      <option value="reserved">Rezerv</option>
                      <option value="occupied">Dolu</option>
                      <option value="disabled">Bağlı</option>
                    </select>
                  </label>

                  <div style={styles.cardActions}>
                    <button style={styles.button()} type="button" onClick={() => startEdit(t)}>
                      Dəyiş
                    </button>
                    <button style={styles.button("danger")} type="button" onClick={() => onDelete(t.id)}>
                      Sil
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
