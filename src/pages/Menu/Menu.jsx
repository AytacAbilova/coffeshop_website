import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createOrder,
  getCart,
  getMenuItems,
  saveCart,
} from "../Admin/adminStorage";
import "./Menu.css";

export default function CafeMenu() {
  const navigate = useNavigate();

  const menuItems = useMemo(() => getMenuItems(), []);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => getCart());
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const cartCount = useMemo(
    () => cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0),
    [cart]
  );

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, it) =>
          sum + (Number(it.qty) || 0) * (Number(it.price) || 0),
        0
      ),
    [cart]
  );

  function persist(next) {
    setCart(next);
    saveCart(next);
  }

  function addToCart(item) {
    const id = item.id;
    const next = [...cart];
    const idx = next.findIndex((c) => c.id === id);

    if (idx >= 0) {
      const qty = (Number(next[idx].qty) || 0) + 1;
      next[idx] = { ...next[idx], qty };
      persist(next);
      return;
    }

    persist([
      {
        id,
        name: item.name,
        price: Number(item.price) || 0,
        imageUrl: item.imageUrl || "",
        qty: 1,
      },
      ...next,
    ]);
  }

  function decQty(id) {
    const next = cart
      .map((it) =>
        it.id === id
          ? { ...it, qty: (Number(it.qty) || 0) - 1 }
          : it
      )
      .filter((it) => (Number(it.qty) || 0) > 0);

    persist(next);
  }

  function incQty(id) {
    const next = cart.map((it) =>
      it.id === id
        ? { ...it, qty: (Number(it.qty) || 0) + 1 }
        : it
    );

    persist(next);
  }

  function removeItem(id) {
    persist(cart.filter((it) => it.id !== id));
  }

  function clearAll() {
    persist([]);
  }

  function placeOrder(e) {
    e.preventDefault();
    setMessage("");

    if (cart.length === 0) return;

    const name = customerName.trim();
    const phone = customerPhone.trim();

    if (!name || !phone) return;

    createOrder({
      customer: { name, phone },
      note: note.trim(),
      items: cart,
      total,
      currency: "AZN",
    });

    clearAll();
    setCartOpen(false);
    setCustomerName("");
    setCustomerPhone("");
    setNote("");

    setMessage("Sifarişiniz qəbul olundu.");
    navigate("/myorders");
  }

  return (
    <div className="menu-page">
      <div className="container">
        <div className="menu__top">
          <div>
            <p className="menu__eyebrow">OUR MENU</p>
            <h1 className="menu__title">Coffee & Snacks</h1>
          </div>

          <button
            type="button"
            className="menu__cartBtn"
            onClick={() => setCartOpen(true)}
          >
            Səbət
            <span className="menu__cartBadge">{cartCount}</span>
          </button>
        </div>

        {message ? (
          <div className="menu__message">{message}</div>
        ) : null}

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() =>
                navigate(`/menu/${item.id}`)
              }
              style={{ cursor: "pointer" }}
            >
              <div className="menu-card__imgWrap">
                {item.imageUrl ? (
                  <img
                    className="menu-card__img"
                    src={item.imageUrl}
                    alt={item.name}
                  />
                ) : (
                  <div className="menu-card__imgFallback" />
                )}
              </div>

              <div className="menu-card__body">
                <div className="menu-card__row">
                  <h2 className="menu-card__name">
                    {item.name}
                  </h2>
                  <span className="menu-card__price">
                    ₼{Number(item.price || 0).toFixed(2)}
                  </span>
                </div>

                <div className="menu-card__row">
                  <span className="menu-card__chip">
                    {item.category === "food"
                      ? "Yemək"
                      : "İçki"}
                  </span>

                  <button
                    type="button"
                    className="menu-card__add"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                  >
                    Səbətə at
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {cartOpen && (
        <div
          className="cartOverlay"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="cartDrawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cartDrawer__top">
              <h2>Səbət</h2>
              <button onClick={() => setCartOpen(false)}>
                Bağla
              </button>
            </div>

            {/* CART CONTENT unchanged */}
          </div>
        </div>
      )}
    </div>
  );
}