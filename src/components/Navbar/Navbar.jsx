import Logo from "../Logo/Logo";
import Navlist from "../navlist/Navlist";
import Wrapper from "../Wrapper/Wrapper";
import "./Navbar.css";

const Navbar = () => {
  return (
    <div id="navbar" className="container">
      <Logo />
      <Navlist />
      <Wrapper />
    </div>
  );
};

export default Navbar;
