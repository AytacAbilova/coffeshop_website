import { useState } from "react";
import { FaHeart, FaSignOutAlt, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthTokens, getCurrentUser, getAccessToken } from "../../pages/Admin/adminStorage";
import "./Wrapper.css";

const Wrapper = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const token = getAccessToken();
  const user = getCurrentUser();

  const isLoggedIn = Boolean(token);

  function logout() {
    try {
      localStorage.removeItem("user");
    } catch {
      return;
    }
    clearAuthTokens();
    setOpen(false);
    navigate("/login");
  }

  return (
    <div className="wrapper">
      {isLoggedIn ? (
        <div className="profile">
          <button
            type="button"
            className="profileBtn"
            onClick={() => setOpen((p) => !p)}
            aria-label="Profile"
          >
            <FaUser className="login" />
          </button>

          {open ? (
            <div className="profileMenu">
              <div className="profileMeta">
                <p className="profileName">
                  {user?.fullName || user?.customerFullName || "User"}
                </p>
                <p className="profileEmail">{user?.email || "-"}</p>
              </div>

              <Link className="profileLink" to="/myorders" onClick={() => setOpen(false)}>
                Profil
              </Link>

              <button type="button" className="profileLogout" onClick={logout}>
                <FaSignOutAlt /> Çıxış
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <Link to="/login">
          <FaUser className="login" />
        </Link>
      )}

      <Link to="/wishlist">
        <FaHeart className="wishlist-icon" />
      </Link>
    </div>
  );
};

export default Wrapper;
