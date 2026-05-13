import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Wrapper.css"

const Wrapper = () => {
  return (
    <div>
      <Link to="/login">
        <FaUser className="login"/>
      </Link>
    </div>
  );
};

export default Wrapper;
