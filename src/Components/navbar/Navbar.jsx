import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div>
        <a href="#">
          <img src="./images/logo.png" alt="logo" className="logo" />
        </a>
      </div>

      <div className="search">
        <input type="text" placeholder="Search" />
        <button>Go</button>
      </div>

      <ul className="nav-links">
        <li><a href="#about-us">About Us</a></li>

        <li>
          <a href="#holiday-offers">Holiday Offers</a>
        </li>

        <li><a href="#gift-card">Gift Card</a></li>
        <li><a href="#business-to-business">Business to Business</a>
                    
        </li>
        <li><a href="#add-to-purchase-order">Add to Purchase Order</a></li>
        <li><a href="#contact-us">Contact Us</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;