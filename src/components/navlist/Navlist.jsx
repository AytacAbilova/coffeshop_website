import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavList.css";

const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "RESERVATION", to: "/reservation" },
  { label: "MENU", to: "/menu" },
  { label: "MY ORDERS", to: "/myorders" },
  { label: "CONTACT", to: "/contact" },
];

export default function NavList() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="nav">
      {/* Hamburger button — mobile only */}
      <button
        className={`nav__hamburger${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Link list */}
      <ul className={`nav-list${menuOpen ? " nav-list--open" : ""}`}>
        {NAV_LINKS.map(({ label, to }) => (
          <li key={to}>
            <Link
              to={to}
              className={`nav-list__link${pathname === to ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
