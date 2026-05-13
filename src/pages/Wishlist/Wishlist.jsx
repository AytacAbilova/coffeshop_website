import { useMemo, useState } from "react";
import {
  getWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../Admin/adminStorage";
import { toast } from "react-toastify";
import "./Wishlist.css";

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("az-AZ");
}

export default function Wishlist() {
  const [items, setItems] = useState(() => getWishlist());

  const itemCount = useMemo(() => items.length, [items]);

  function refresh() {
    setItems(getWishlist());
    toast.info("Yeniləndi");
  }

  function handleRemove(id) {
    removeFromWishlist(id);
    setItems(getWishlist());
    toast.info("Məhsul wishlist-dən silindi");
  }

  function handleClearAll() {
    if (window.confirm("Bütün istək siyahısını silmək istədiyinizə əminsiniz?")) {
      clearWishlist();
      setItems([]);
      toast.error("Wishlist tam təmizləndi");
    }
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-top">
          <div>
            <p className="wishlist-eyebrow">MY ACCOUNT</p>
            <h1 className="wishlist-title">İstək siyahısı</h1>
          </div>

          <div className="wishlist-actions">
            {items.length > 0 && (
              <button
                type="button"
                className="wishlist-clear"
                onClick={handleClearAll}
              >
                Hamısını sil
              </button>
            )}

            <button
              type="button"
              className="wishlist-refresh"
              onClick={refresh}
            >
              Yenilə
            </button>
          </div>
        </div>

        <div className="wishlist-meta">
          <span className="wishlist-badge">{itemCount}</span>
          <span className="wishlist-metaLabel">məhsul əlavə edilib</span>
        </div>

        <div className="wishlist-list">
          {items.length === 0 ? (
            <p className="wishlist-empty">İstək siyahınız boşdur.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-cardTop">
                  <div className="wishlist-cardLeft">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="wishlist-cardImage"
                      />
                    ) : (
                      <div className="wishlist-cardImagePlaceholder">
                        <span>🍽️</span>
                      </div>
                    )}

                    <div className="wishlist-cardInfo">
                      <p className="wishlist-cardTitle">{item.name}</p>

                      {item.category && (
                        <p className="wishlist-cardMeta">
                          Kateqoriya: {item.category}
                        </p>
                      )}

                      {item.description && (
                        <p className="wishlist-cardDesc">
                          {item.description}
                        </p>
                      )}

                      <p className="wishlist-cardMeta">
                        Əlavə edildi: {formatDate(item.addedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="wishlist-cardRight">
                    <div className="wishlist-price">
                      ₼{Number(item.price || 0).toFixed(2)}
                    </div>

                    <button
                      type="button"
                      className="wishlist-remove"
                      onClick={() => handleRemove(item.id)}
                      title="Siyahıdan çıxar"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}