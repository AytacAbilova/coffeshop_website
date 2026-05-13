import { Link } from "react-router-dom";
import logoImg from "../../assets/img/logo.avif";

const Logo = () => {
  return (
    <div>
      <Link to='/'>
        <img src={logoImg} alt="" />
      </Link>
    </div>
  );
};

export default Logo;
