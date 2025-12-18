import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/ContextProvider.jsx";
import "./navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
<nav className="navbar">
  <div className="navbar-container">
    <div className="logo-container">
      <Link to="/"><img src="/images/logo.png" alt="logo" className="logo" /></Link>
    </div>

    {/* Top-level menu */}
    <ul className="top-menu right-align">
      <li><Link to="/about">About Us</Link></li>
      <li><Link to="#">Holiday Offers</Link></li>
      {/* <li><Link to="/product">Products</Link></li> */}
      <li><Link to="#">Gift Card</Link></li>
      <li><Link to="#">Business to Business</Link></li>
      <Link to="/purchase-order">Purchase Order</Link>
      <li><Link to="/contact">Contact Us</Link></li>
      {/* <li><Link to="/signin">Sign In</Link></li> */}
    </ul>
  </div>
 
  {/* Second-level menu row */}
  <ul className="second-level-row right-align">
    <li className="has-dropdown">
      <li><Link to="/category/electronics">Electronics</Link></li>
      <div className="mega-menu">
        <div className="mega-column">
          <Link to="/product/693c3e068d8ccb03a032c1ae">Vacuum Sealing Machine</Link>
          <Link to="/product/693c3e068d8ccb03a032c1b1">Campfire Light</Link>
          <Link to="/product/6942f1628d8ccb03a032c1d6">Bladeless Fan</Link>
          <Link to="/product/693c3e068d8ccb03a032c1af">Digital Photoframe</Link>
        </div>
      </div>
    </li>

    <li className="has-dropdown">
      <li><Link to="/category/fashion">Fashion</Link></li>
      <div className="mega-menu">
        <div className="mega-column">
          <Link to="/category/men">Men</Link>
          <Link to="/category/women">Women</Link>
          <Link to="/category/kids">Kids</Link>
        </div>
      </div>
    </li>

    <li className="has-dropdown">
      <li><Link to="/category/accessories">Evening Clutches</Link></li>
      <div className="mega-menu">
        <div className="mega-column">
          <Link to="/category/accessories">All Clutches</Link>
          <Link to="/product/693c3e068d8ccb03a032c1b8">Jute Bags</Link>
        </div>
      </div>
    </li>

    <li className="has-dropdown">
      <Link to="/product/693c3e068d8ccb03a032c1ad">Robots</Link>
      <div className="mega-menu">
        <div className="mega-column">
          <Link to="/product/693c3e068d8ccb03a032c1ad">Educational Robots</Link>
        </div>
      </div>
    </li>
  </ul>
</nav>


  );
};

export default Navbar;
