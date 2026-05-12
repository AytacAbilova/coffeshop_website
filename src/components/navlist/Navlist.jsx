import { Link } from "react-router-dom";
import "./Navlist.css";

const Navlist = () => {
  return (
    <div >
      <ul className="list">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/reservation">Reservation</Link>
        </li>
        <li>
          <Link to="/menu">Menu</Link>
        </li>
        <li>
          <Link to="/myorders">My Orders</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navlist;
