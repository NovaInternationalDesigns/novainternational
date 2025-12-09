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
              <span className="category-label">Categories ▸</span>
              <ul className="submenu">
                <li><Link to="/category/electronics">Electronics</Link></li>
                <li><Link to="/category/fashion">Fashion</Link></li>
                <li><Link to="/category/accessories">Accessories</Link></li>
                <li><Link to="/category/phone-models">Phone Models</Link></li>
              </ul>
            </li>
          </ul>
        </li>

        <li><a href="#gift-card">Gift Card</a></li>
        <li><Link to="/product">Products</Link></li>

        {/* B2B */}
        <li className="has-dropdown">
          <a href="#business-to-business">Business to Business ▾</a>
          <ul className="dropdown">

            {/* Digital Purchase Order section */}
            <li className="has-submenu">
              <Link to="/purchase-order">Digital Purchase Order ▸</Link>

              <ul className="submenu">
                <li><Link to="/category/electronics">Electronics</Link></li>
                <li><Link to="/category/fashion">Fashion</Link></li>
                <li><Link to="/category/accessories">Accessories</Link></li>
                <li><Link to="/category/phone-models">Phone Models</Link></li>

                <li><Link to="/b2b/wholesale-order">Wholesale Order</Link></li>
                <li><Link to="/b2b/retail-order">Retail Order</Link></li>
                <li><Link to="/b2b/mqo">Minimum Quantity Order (MQO)</Link></li>
                <li><Link to="/b2b/repeat-order">Repeating Purchase Order</Link></li>
                <li><Link to="/b2b/delivery-terms">Delivery Terms</Link></li>
                <li><Link to="/b2b/payment-terms">Payment Terms</Link></li>
                <li><Link to="/b2b/inventory">Inventory</Link></li>
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
