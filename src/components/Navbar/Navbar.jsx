import Logo from "../Logo/Logo";
import Navlist from "../navlist/Navlist";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div id="navbar" className="container">
      <Logo />
      <Navlist />
    </div>
  );
};

export default Navbar;
