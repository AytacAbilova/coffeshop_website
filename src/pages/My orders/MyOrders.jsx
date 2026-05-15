import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLoaderData } from "react-router-dom";
import {
  apiDeleteOrder,
  apiGetOrdersByCustomer,
  apiGetMyReservations,
  getCurrentUserId,
} from "../Admin/adminStorage";
import "./MyOrders.css";

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("az-AZ");
}

function normalizeOrder(o) {
  const id = o?.id ?? o?.orderId ?? o?.orderID;
  const createdAt = o?.createdAt ?? o?.createdDate ?? o?.date ?? o?.created_on;
  const status = o?.status ?? o?.orderStatus ?? "new";
  const tableId = o?.tableId ?? o?.tableID ?? 0;
  const items = Array.isArray(o?.items) ? o.items : [];
  return { ...o, id, createdAt, status, tableId, items };
}

export default function MyOrders() {
  const loaderData = useLoaderData();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState(() =>
    Array.isArray(loaderData?.orders) ? loaderData.orders.map(normalizeOrder) : []
  );
  const [reservations, setReservations] = useState(() =>
    Array.isArray(loaderData?.reservations) ? loaderData.reservations : []
  );
  const [loading, setLoading] = useState(false);
  const [menuMap, setMenuMap] = useState(() => new Map());

  const ordersCount = useMemo(() => orders.length, [orders]);
  const reservationsCount = useMemo(() => reservations.length, [reservations]);

  async function refresh() {
    const customerId = getCurrentUserId();
    if (!customerId) {
      setOrders([]);
      setReservations([]);
      return;
    }

    setLoading(true);
    try {
      const res = await apiGetOrdersByCustomer(customerId);
      if (!res.ok) {
        toast.error("Sifarişləri yükləmək olmadı");
        setOrders([]);
      } else {
        const list = Array.isArray(res.data) ? res.data.map(normalizeOrder) : [];
        setOrders(list);
      }

      const r = await apiGetMyReservations();
      if (!r.ok) {
        toast.error("Rezervasiyanı yükləmək olmadı");
        setReservations([]);
      } else {
        setReservations(Array.isArray(r.data) ? r.data : []);
      }
    } catch (e) {
      console.log(e);
      toast.error("Xəta baş verdi");
      setOrders([]);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await axios.get(
          "https://simulation2-production-7983.up.railway.app/api/MenuItems"
        );
        const list = Array.isArray(res.data) ? res.data : [];
        const map = new Map(list.map((it) => [Number(it.id), it]));
        if (alive) setMenuMap(map);
      } catch {
        if (alive) setMenuMap(new Map());
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  async function deleteOrder(id) {
    const ok = window.confirm("Sifarişi silmək istədiyinizə əminsiniz?");
    if (!ok) return;

    try {
      const res = await apiDeleteOrder(id);
      if (!res.ok) {
        toast.error("Silmək mümkün olmadı");
        return;
      }
      toast.success("Sifariş silindi");
      setOrders((prev) => prev.filter((o) => o.id !== id));
    } catch (e) {
      console.log(e);
      toast.error("Xəta baş verdi");
    }
  }

  return (
    <div className="myorders-page">
      <div className="container">
        <div className="myorders-top">
          <div>
            <p className="myorders-eyebrow">MY ACCOUNT</p>
            <h1 className="myorders-title">Sifariş tarixçəsi</h1>
          </div>

          <div className="myorders-actions">
            <button type="button" className="myorders-refresh" onClick={refresh}>
              {loading ? "Yüklənir..." : "Yenilə"}
            </button>
          </div>
        </div>

        <div className="myorders-tabs">
          <button
            type="button"
            className={`myorders-tab${tab === "orders" ? " active" : ""}`}
            onClick={() => setTab("orders")}
          >
            Sifarişlər <span className="myorders-badge">{ordersCount}</span>
          </button>
          <button
            type="button"
            className={`myorders-tab${tab === "reservations" ? " active" : ""}`}
            onClick={() => setTab("reservations")}
          >
            Rezervasiyalar{" "}
            <span className="myorders-badge">{reservationsCount}</span>
          </button>
        </div>

        {tab === "orders" ? (
          <div className="myorders-list">
            {orders.length === 0 ? (
              <p className="myorders-empty">
                {getCurrentUserId()
                  ? "Hələ sifariş yoxdur."
                  : "Sifariş tarixçəsi üçün login olun."}
              </p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="myorders-card">
                  <div className="myorders-cardTop">
                    <div>
                      <p className="myorders-cardTitle">Online sifariş</p>
                      <p className="myorders-cardMeta">
                        {formatDate(o.createdAt)} · Status: {o.status || "new"} · Masa:{" "}
                        {Number(o.tableId) || 0}
                      </p>
                    </div>
                    <div className="myorders-cardRight">
                      <div className="myorders-total">
                        ₼
                        {(() => {
                          const rawTotal = Number(o.total);
                          if (Number.isFinite(rawTotal) && rawTotal >= 0) return rawTotal.toFixed(2);
                          const calc = Array.isArray(o.items)
                            ? o.items.reduce((sum, it) => {
                                const menu = menuMap.get(Number(it.menuItemId));
                                const price = Number(menu?.price) || 0;
                                const qty = Number(it.quantity) || 0;
                                return sum + price * qty;
                              }, 0)
                            : 0;
                          return calc.toFixed(2);
                        })()}
                      </div>
                      <button
                        type="button"
                        className="myorders-delete"
                        onClick={() => deleteOrder(o.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </div>

                  <div className="myorders-items">
                    {Array.isArray(o.items) && o.items.length ? (
                      o.items.map((it) => (
                        <div key={`${o.id}_${it.id}`} className="myorders-itemRow">
                          <span className="myorders-itemName">
                            {menuMap.get(Number(it.menuItemId))?.name ||
                              `MenuItem #${it.menuItemId}`}
                          </span>
                          <span className="myorders-itemQty">x{it.quantity}</span>
                          <span className="myorders-itemPrice">
                            ₼
                            {Number(
                              menuMap.get(Number(it.menuItemId))?.price || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="myorders-emptySmall">Item yoxdur.</p>
                    )}
                  </div>

                  {o.note ? <p className="myorders-note">Qeyd: {o.note}</p> : null}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="myorders-list">
            {reservations.length === 0 ? (
              <p className="myorders-empty">Hələ rezervasiya yoxdur.</p>
            ) : (
              reservations.map((r) => (
                <div key={r.id} className="myorders-card">
                  <div className="myorders-cardTop">
                    <div>
                      <p className="myorders-cardTitle">Masa rezervasiyası</p>
                      <p className="myorders-cardMeta">
                        {formatDate(r.startDatetime)} · Status: {r.status || "pending"}
                      </p>
                      <p className="myorders-cardMeta">
                        Başlanğıc: {formatDate(r.startDatetime)} · Bitmə:{" "}
                        {formatDate(r.endDatetime)}
                      </p>
                      <p className="myorders-cardMeta">
                        Müştəri: {r.customerFullName || "-"} · {r.customerEmail || "-"}
                      </p>
                    </div>
                    <div className="myorders-pill">
                      Masa #{r.tableNumber} · Tutum: {r.tableCapacity}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
