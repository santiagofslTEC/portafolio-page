import "./Navbar.css";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">SF</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/Projects">Projects</Link>
        <Link to="/AboutMe">About Me</Link>
        <Link to="/ContactMe">Contact Me</Link>
      </div>
    </nav>
  );
};

export default Navbar;