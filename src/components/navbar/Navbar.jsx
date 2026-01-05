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
          <Link to="/">
            <img src="/images/logo.png" alt="logo" className="logo" />
          </Link>
        </div>

        {/* Top-level menu */}
        <ul className="top-menu right-align">
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="#">Holiday Offers</Link></li>
          <li><Link to="#">Gift Card</Link></li>
          <li><Link to="#">Business to Business</Link></li>
          <li><Link to="/purchase-order">Purchase Order</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          {isAuthenticated ? (
            <li><button onClick={logout}>Logout</button></li>
          ) : (
            <li><Link to="/signin">Sign In</Link></li>
          )}
        </ul>
      </div>

      {/* Second-level mega menu */}
      <ul className="second-level-row right-align">
        {/* Electronics */}
        <li className="has-dropdown">
          <Link to="/category/electronics">Electronics</Link>
          <div className="mega-menu">
            <div className="mega-column">
              <Link to="/product/693c3e068d8ccb03a032c1ae">Vacuum Sealing Machine</Link>
              <Link to="/product/693c3e068d8ccb03a032c1b1">Campfire Light</Link>
              <Link to="/product/6942f1628d8ccb03a032c1d6">Bladeless Fan</Link>
              <Link to="/product/693c3e068d8ccb03a032c1af">Digital Photoframe</Link>
            </div>
          </div>
        </li>

        {/* Fashion */}
        <li className="has-dropdown">
          <Link to="/category/fashion">Fashion</Link>
          <div className="mega-menu">
            <div className="mega-column">
              <Link to="/category/fashion/men">Men</Link>
              <Link to="/category/fashion/women">Women</Link>
              <Link to="/category/fashion/kids">Kids</Link>
            </div>
          </div>
        </li>

        {/* Accessories */}
        <li className="has-dropdown">
          <Link to="/category/accessories">Evening Clutches</Link>
          <div className="mega-menu">
            <div className="mega-column">
              <Link to="/category/accessories">All Clutches</Link>
              <Link to="/product/693c3e068d8ccb03a032c1b8">Jute Bags</Link>
            </div>
          </div>
        </li>

        {/* Robots */}
        <li className="has-dropdown">
          <Link to="/category/robots">Robots</Link>
          <div className="mega-menu">
            <div className="mega-column">
              <Link to="/product/6944408b8d8ccb03a032c1f8">Educational Robots</Link>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
