import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2025 Nova International Designs Corporation. All rights reserved.</p>

      <div className="social-icons">
        <a href="https://www.facebook.com/profile.php?id=61584196192112" target="_blank"><img src="/images/facebook-logo.png" alt="Facebook" /></a>
        <a href="https://www.instagram.com/novainternationaldesigns/" target="_blank"><img src="/images/instagram-logo.png" alt="Instagram" /></a>
        <a href="#" target="_blank"><img src="/images/linkedIn-logo.png" alt="LinkedIn" /></a>
        <a href="#" target="_blank"><img src="/images/x_logo.png" alt="X" /></a>
      </div>
    </footer>
  );
};

export default Footer;