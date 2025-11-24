import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Nova International Designs Corporation. All rights reserved.</p>

      <div className="social-icons">
        <a href="https://www.facebook.com/profile.php?id=61584196192112"><img src="./images/facebook-icon.png" alt="Facebook" target="_blank" /></a>
        <a href="#"><img src="./images/instagram-icon.png" alt="Instagram" /></a>
      </div>
    </footer>
  );
};

export default Footer;