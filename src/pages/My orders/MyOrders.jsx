import { useMemo, useState } from "react";
import { getOrders, getReservations } from "../Admin/adminStorage";
import "./MyOrders.css";

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("az-AZ");
}

export default function MyOrders() {
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState(() => getOrders());
  const [reservations, setReservations] = useState(() => getReservations());

  const ordersCount = useMemo(() => orders.length, [orders]);
  const reservationsCount = useMemo(() => reservations.length, [reservations]);

  function refresh() {
    setOrders(getOrders());
    setReservations(getReservations());
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
              Yenilə
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
              <p className="myorders-empty">Hələ sifariş yoxdur.</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="myorders-card">
                  <div className="myorders-cardTop">
                    <div>
                      <p className="myorders-cardTitle">Online sifariş</p>
                      <p className="myorders-cardMeta">
                        {formatDate(o.createdAt)} · Status: {o.status || "new"}
                      </p>
                      <p className="myorders-cardMeta">
                        Müştəri: {o.customer?.name || "-"} · {o.customer?.phone || "-"}
                      </p>
                    </div>
                    <div className="myorders-total">
                      ₼{Number(o.total || 0).toFixed(2)}
                    </div>
                  </div>

                  <div className="myorders-items">
                    {Array.isArray(o.items) && o.items.length ? (
                      o.items.map((it) => (
                        <div key={`${o.id}_${it.id}`} className="myorders-itemRow">
                          <span className="myorders-itemName">{it.name}</span>
                          <span className="myorders-itemQty">x{it.qty}</span>
                          <span className="myorders-itemPrice">
                            ₼{Number(it.price || 0).toFixed(2)}
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
                        {formatDate(r.createdAt)} · Status: {r.status || "pending"}
                      </p>
                      <p className="myorders-cardMeta">
                        Tarix/Saat: {r.date || "-"} {r.time || "-"} · Nəfər:{" "}
                        {r.guests || "-"}
                      </p>
                      <p className="myorders-cardMeta">
                        Müştəri: {r.customer?.name || "-"} · {r.customer?.phone || "-"}
                      </p>
                    </div>
                    <div className="myorders-pill">
                      {r.tableNumber ? `Masa #${r.tableNumber}` : "Masa seçilməyib"}
                    </div>
                  </div>

                  {r.note ? <p className="myorders-note">Qeyd: {r.note}</p> : null}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
