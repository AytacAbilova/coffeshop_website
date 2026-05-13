import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Wrapper.css";

const Wrapper = () => {
  return (
    <div className="wrapper">
      <Link to="/login">
        <FaUser className="login" />
      </Link>

      <Link to="/wishlist">
        <FaHeart className="wishlist-icon" />
      </Link>
    </div>
  );
};

export default Wrapper;
