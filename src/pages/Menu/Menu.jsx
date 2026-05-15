import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  getCart,
  saveCart,
  addToWishlist,
  removeFromWishlist,
  isInWishlist,
  apiCreateOrder,
  getCurrentUserId,
} from "../Admin/adminStorage";

import "./Menu.css";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Menu() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);

  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState(() => getCart());

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableId, setTableId] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  // MENU ITEMS API
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const res = await axios.get(
          "https://simulation2-production-7983.up.railway.app/api/MenuItems"
        );

        setMenuItems(res.data);
      } catch (error) {
        console.log(error);
        toast.error("Menu yüklənmədi");
      }
    };

    fetchMenuItems();
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, it) => sum + (Number(it.qty) || 0), 0),
    [cart]
  );

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, it) => sum + (Number(it.qty) || 0) * (Number(it.price) || 0),
        0
      ),
    [cart]
  );

  function persist(next) {
    setCart(next);
    saveCart(next);
  }

  // CART
  function addToCart(item) {
    const id = item.id;
    const next = [...cart];

    const idx = next.findIndex((c) => c.id === id);

    if (idx >= 0) {
      const qty = (Number(next[idx].qty) || 0) + 1;

      next[idx] = {
        ...next[idx],
        qty,
      };

      persist(next);

      toast.success("Səbətə əlavə olundu");
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

    toast.success("Səbətə əlavə olundu");
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
    toast.error("Səbətdən silindi");
  }

  function clearAll() {
    persist([]);
  }

  // WISHLIST
  function toggleWishlist(item) {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
      toast.error("Wishlist-dən silindi");
    } else {
      addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.imageUrl,
      });

      toast.success("Wishlist-ə əlavə olundu");
    }
  }

  // ORDER
  async function placeOrder(e) {
    e.preventDefault();

    setMessage("");

    if (cart.length === 0) return;

    const name = customerName.trim();
    const phone = customerPhone.trim();

    if (!name || !phone) return;

    const customerId = getCurrentUserId();
    if (!customerId) {
      toast.error("Sifariş vermək üçün əvvəlcə login olun.");
      navigate("/login");
      return;
    }

    const apiItems = cart.map((it) => ({
      menuItemId: Number(it.id),
      quantity: Number(it.qty) || 0,
    }));

    if (apiItems.some((it) => !Number.isFinite(it.menuItemId) || it.menuItemId <= 0)) {
      toast.error("Səbətdə ID problemi var (menu item ID). Menyu API-dən yüklənsin.");
      return;
    }

    try {
      const res = await apiCreateOrder({
        customerId,
        tableId: Number(tableId) || 0,
        items: apiItems,
      });

      if (!res.ok) {
        toast.error("Sifariş göndərilmədi.");
        return;
      }

      clearAll();

      setCartOpen(false);

      setCustomerName("");
      setCustomerPhone("");
      setTableId("");
      setNote("");

      setMessage("Sifarişiniz qəbul olundu.");

      navigate("/myorders");
    } catch (error) {
      console.log(error);
      toast.error("Xəta baş verdi");
    }
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
            className="menu__cartBtn"
            onClick={() => setCartOpen(true)}
          >
            Səbət

            {cartCount > 0 && (
              <span className="menu__cartBadge">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {message && (
          <div className="menu__message">
            {message}
          </div>
        )}

        <div className="menu-grid">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="menu-card"
              onClick={() => navigate(`/menu/${item.id}`)}
            >
              <div className="menu-card__imgWrap">
                <div className="menu-card__imgFallback" />

                <button
                  className="menu-card__heart"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item);
                  }}
                >
                  {isInWishlist(item.id) ? (
                    <FaHeart color="red" />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
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

                <p className="menu-card__desc">
                  {item.description}
                </p>

                <div className="menu-card__row">
                  <span className="menu-card__chip">
                    Coffee
                  </span>

                  <button
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

      {/* CART DRAWER */}
      {cartOpen ? (
        <div
          className="cartOverlay"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="cartDrawer"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cartDrawer__top">
              <h2 className="cartDrawer__title">
                Səbət
              </h2>

              <button
                type="button"
                className="cartDrawer__close"
                onClick={() => setCartOpen(false)}
              >
                Bağla
              </button>
            </div>

            {cart.length === 0 ? (
              <p className="cartDrawer__empty">
                Səbət boşdur.
              </p>
            ) : (
              <>
                <div className="cartList">
                  {cart.map((it) => (
                    <div
                      key={it.id}
                      className="cartItem"
                    >
                      <div className="cartItem__body">
                        <div className="cartItem__row">
                          <p className="cartItem__name">
                            {it.name}
                          </p>

                          <p className="cartItem__price">
                            ₼
                            {Number(
                              it.price || 0
                            ).toFixed(2)}
                          </p>
                        </div>

                        <div className="cartItem__row">
                          <div className="cartItem__qty">
                            <button
                              onClick={() =>
                                decQty(it.id)
                              }
                              className="qtyBtn"
                            >
                              -
                            </button>

                            <span className="qtyVal">
                              {it.qty}
                            </span>

                            <button
                              onClick={() =>
                                incQty(it.id)
                              }
                              className="qtyBtn"
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="cartItem__remove"
                            onClick={() =>
                              removeItem(it.id)
                            }
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cartSummary">
                  <div className="cartSummary__row">
                    <span>Cəm</span>

                    <span className="cartSummary__total">
                      ₼{total.toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="cartSummary__clear"
                    onClick={clearAll}
                  >
                    Səbəti təmizlə
                  </button>
                </div>

                <form className="checkout" onSubmit={placeOrder}>
                  <p className="checkout__title">
                    Online sifariş
                  </p>
                  <input
                    className="checkout__input"
                    placeholder="Ad Soyad"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                  <input
                    className="checkout__input"
                    placeholder="Telefon"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                  <input
                    className="checkout__input"
                    type="number"
                    min={0}
                    placeholder="Masa ID (istəyə bağlı)"
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                  />
                  <textarea
                    className="checkout__input checkout__textarea"
                    placeholder="Qeyd (istəyə bağlı)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                  <button className="checkout__btn" type="submit">
                    Sifarişi göndər
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
