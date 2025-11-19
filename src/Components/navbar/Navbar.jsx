import React from "react";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
         <a href="#"><img src="/logo.png" alt='logo' className='logo'></img></a>
      </div>
      
      <search>
        <input type="text" placeholder="Search"></input>
        <button>Go</button>
      </search>
      <ul className="nav-links">
        <li><a href="#holiday-deals">Holiday Deals</a></li>
        <li><a href="#festive-deals">Festive Deals</a></li>
        <li><a href="#best-seller">Best Seller</a></li>
        <li><a href="#gift-card">Gift Card</a></li>
        <li><a href="#contact-us">Contact Us</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;