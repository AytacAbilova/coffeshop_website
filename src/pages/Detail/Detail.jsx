import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getMenuItems, getCart, saveCart } from "../Admin/adminStorage";
import "./Detail.css";

function CardDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const menuItems = useMemo(() => getMenuItems(), []);

  function addToCart(item) {
    const cart = getCart();
    const idx = cart.findIndex((c) => c.id === item.id);
    let next;
    if (idx >= 0) {
      next = cart.map((c) =>
        c.id === item.id ? { ...c, qty: (Number(c.qty) || 0) + 1 } : c
      );
    } else {
      next = [
        { id: item.id, name: item.name, price: Number(item.price) || 0,
          imageUrl: item.imageUrl || "", qty: 1 },
        ...cart,
      ];
    }
    saveCart(next);
    navigate("/menu");
  }

  /* ── Menu detail ── */
  if (id !== undefined) {
    const item = menuItems.find((m) => String(m.id) === String(id));

    if (!item) {
      return (
        <div className="detailPage">
          <button onClick={() => navigate(-1)}>← Geri</button>
          <h1>Məhsul tapılmadı</h1>
        </div>
      );
    }

    return (
      <div className="detailPage">
        <button onClick={() => navigate(-1)}>← Geri</button>

        <div className="detailLayout">
          {/* Left — image */}
          {item.imageUrl ? (
            <img className="detailLayout__img" src={item.imageUrl} alt={item.name} />
          ) : (
            <div className="detailLayout__imgFallback">☕</div>
          )}

          {/* Right — info */}
          <div className="detailLayout__info">
            <p className="detailLayout__eyebrow">
              {item.category === "food" ? "Yemək" : "İçki"}
            </p>

            <h1>{item.name}</h1>

            <p className="detailLayout__price">
              ₼{Number(item.price || 0).toFixed(2)}
            </p>

            <span className="detailLayout__chip">
              {item.category === "food" ? "Yemək" : "İçki"}
            </span>

            {item.description && (
              <>
                <div className="detailLayout__divider" />
                <p className="detailLayout__desc">{item.description}</p>
              </>
            )}

            <button
              className="detailLayout__addBtn"
              onClick={() => addToCart(item)}
            >
              + Səbətə at
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Reservation detail ── */
  const reservationData = {
    "1": { icon: "🕗", title: "Opening Hours",
           content: "We are open every day from 08:00 AM to 11:00 PM." },
    "2": { icon: "📍", title: "Location",
           content: "We are located in Baku, Azerbaijan. Easy access from city center." },
  };

  const resItem = reservationData[type];

  return (
    <div className="detailPage">
      <button onClick={() => navigate(-1)}>← Geri</button>
      {!resItem ? (
        <h1>Not Found</h1>
      ) : (
        <div className="detailLayout">
          <div className="detailLayout__imgFallback">{resItem.icon}</div>
          <div className="detailLayout__info">
            <h1>{resItem.title}</h1>
            <div className="detailLayout__divider" />
            <p className="detailLayout__desc">{resItem.content}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CardDetail;