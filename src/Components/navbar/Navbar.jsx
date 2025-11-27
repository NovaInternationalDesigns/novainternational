import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/">
          <img src="./images/logo.png" alt="logo" className="logo" />
        </Link>
      </div>

      <ul className="nav-links">

        <li><Link to="/about">About Us</Link></li>

        {/* HOLIDAY OFFERS */}
        <li className="has-dropdown">
          <a href="#holiday-offers">Holiday Offers ▾</a>

          <ul className="dropdown">
            <li className="has-submenu">
              <a href="#">Catagories ▸</a>

              <ul className="submenu">
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Fashion</a></li>
                <li><a href="#">Evening Bags</a></li> 
                <li><a href="#">Hand Bags</a></li>
              </ul>

            </li>
          </ul>
        </li>

        <li><a href="#gift-card">Gift Card</a></li>

        {/* B2B */}
        <li className="has-dropdown">
        <a href="#business-to-business">Business to Business ▾</a>

          <ul className="dropdown">

            <li className="has-submenu">
              <a href="#">Digital Purchase Order ▸</a>

              <ul className="submenu">
                <li><a href="#">Electronics</a></li>
                <li><a href="#">Fashion</a></li>
                <li><a href="#">Evening Bags</a></li>
                <li><a href="#">Hand Bags</a></li>
                <li><a href="#">Wholesale Order</a></li>
                <li><a href="#">Retail Order</a></li>
                <li><a href="#">Minimum Quantity Order (MOQ)</a></li>
                <li><a href="#">Repeating Purchase Order</a></li>
                <li><a href="#">Delivery Terms</a></li>
                <li><a href="#">Payment Terms</a></li>
                <li><a href="#">Inventory</a></li>
              </ul>
            </li>

    <li><a href="#">Digital Letter Head</a></li>
  </ul>
</li>


        <li><a href="#add-to-purchase-order">Add to Purchase Order</a></li>
        <li><Link to="/contact">Contact Us</Link></li>

      </ul>
    </nav>
  );
};

export default Navbar;
