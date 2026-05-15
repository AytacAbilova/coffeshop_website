import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCart, saveCart, addToWishlist, removeFromWishlist, isInWishlist } from "../Admin/adminStorage";
import "./Detail.css";

const API_URL = "https://simulation2-production-7983.up.railway.app/api/MenuItems";

function Detail() {
  const { type, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    setLoading(true);
    axios
      .get(`${API_URL}/${id}`)
      .then((res) => {
        setItem(res.data);
        setWished(isInWishlist(res.data.id));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  function addToCart(menuItem) {
    const cart = getCart();
    const idx = cart.findIndex((c) => String(c.id) === String(menuItem.id));
    let next;
    if (idx >= 0) {
      next = cart.map((c) =>
        String(c.id) === String(menuItem.id)
          ? { ...c, qty: (Number(c.qty) || 0) + 1 }
          : c
      );
    } else {
      next = [
        {
          id: menuItem.id,
          name: menuItem.name,
          price: Number(menuItem.price) || 0,
          imageUrl: menuItem.imageUrl || "",
          qty: 1,
        },
        ...cart,
      ];
    }
    saveCart(next);
    navigate("/menu");
  }

  function toggleWishlist(menuItem) {
    if (isInWishlist(menuItem.id)) {
      removeFromWishlist(menuItem.id);
      setWished(false);
    } else {
      addToWishlist({
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        image: menuItem.imageUrl || "",
      });
      setWished(true);
    }
  }

  /* ── Menu detail ── */
  if (id !== undefined) {
    if (loading) {
      return (
        <div className="detailPage">
          <button onClick={() => navigate(-1)}>← Geri</button>
          <p style={{ marginTop: 24 }}>Yüklənir...</p>
        </div>
      );
    }

    if (notFound || !item) {
      return (
        <div className="detailPage">
          <button onClick={() => navigate(-1)}>← Geri</button>
          <h1>Məhsul tapılmadı</h1>
        </div>
      );
    }

    const categoryLabel =
      item.description === "food" || item.category === "food" ? "Yemək" : "İçki";

    return (
      <div className="detailPage">
        <button onClick={() => navigate(-1)}>← Geri</button>

        <div className="detailLayout">
          {/* Left — image */}
          {item.imageUrl ? (
            <img
              className="detailLayout__img"
              src={item.imageUrl}
              alt={item.name}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling && (e.target.nextSibling.style.display = "flex");
              }}
            />
          ) : null}
          <div
            className="detailLayout__imgFallback"
            style={item.imageUrl ? { display: "none" } : {}}
          >
            ☕
          </div>

          {/* Right — info */}
          <div className="detailLayout__info">
            <p className="detailLayout__eyebrow">{categoryLabel}</p>

            <h1>{item.name}</h1>

            <p className="detailLayout__price">
              ₼{Number(item.price || 0).toFixed(2)}
            </p>

            <span className="detailLayout__chip">{categoryLabel}</span>

            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button
                className="detailLayout__addBtn"
                onClick={() => toggleWishlist(item)}
                style={{
                  background: wished
                    ? "rgba(239,68,68,0.1)"
                    : undefined,
                  borderColor: wished
                    ? "rgba(239,68,68,0.4)"
                    : undefined,
                  color: wished ? "#991b1b" : undefined,
                }}
              >
                {wished ? "♥ Wishlist-də" : "♡ Wishlist-ə at"}
              </button>
            </div>

            {item.description &&
              item.description !== "food" &&
              item.description !== "drink" && (
                <>
                  <div className="detailLayout__divider" />
                  <p className="detailLayout__desc">{item.description}</p>
                </>
              )}

            <button
              className="detailLayout__addBtn"
              onClick={() => addToCart(item)}
              style={{ marginTop: 12 }}
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
    "1": {
      icon: "🕗",
      title: "Opening Hours",
      content: "We are open every day from 08:00 AM to 11:00 PM.",
    },
    "2": {
      icon: "📍",
      title: "Location",
      content:
        "We are located in Baku, Azerbaijan. Easy access from city center.",
    },
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

export default Detail;