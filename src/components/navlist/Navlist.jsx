import { Link, useLocation } from "react-router-dom";
import "./Navlist.css";

const NAV_LINKS = [
  { label: "HOME", to: "/" },
  { label: "RESERVATION", to: "/reservation" },
  { label: "MENU", to: "/menu" },
  { label: "MY ORDERS", to: "/myorders" },
];

export default function NavList() {
  const { pathname } = useLocation();

  return (
    <ul className="nav-list">
      {NAV_LINKS.map(({ label, to }) => (
        <li key={to}>
          <Link
            to={to}
            className={`nav-list__link${pathname === to ? " active" : ""}`}
          >
            {label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
