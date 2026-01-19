import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/ContextProvider.jsx";
import "./navbar.css";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();


  const menuData = [
  {
    title: "Women",
    path: "/category/fashion/women",
    megaMenu: [
      {
        heading: "Womens >",
        links: [
          { title: "Womens Wear", path: "/category/fashion/women" },
          { title: "Coats and Jackets", path: "#" },
          { title: "Jackets", path: "#" },
          { title: "Sweaters", path: "#" },
          { title: "Tops", path: "#" },
          { title: "Dresses", path: "/category/fashion/women" },
        ],
      },
      {
        heading: "More Sizes >",
        links: [
          { title: "Plus Sizes", path: "#" },
          { title: "Petites", path: "#" },
          { title: "Sneakers", path: "#" },
        ],
      },
      {
        heading: "New & Trending >",
        links: [
          { title: "New Arrivals In Women", path: "#" },
          { title: "Contemporary Trending", path: "#" },
          { title: "New Fashion Desings", path: "#" },
          { title: "Trending Colors Desings", path: "#" },
        ],
      },
    ],
  },
  {
    title: "Electronics",
    path: "/category/electronics",
    megaMenu: [
      {
        heading: "Vacuum Sealers >",
        links: [
          { title: "Zip Lock Vacuum Sealers", path: "product/69667a55081e46fbb391cefe" },
          { title: "Kitchenware Vacuum Sealers", path: "product/69667a55081e46fbb391cefe" },
          { title: "Technologically Advance Vacuum Sealers", path: "product/69667a55081e46fbb391cefe" },
        ],
      },
      {
        heading: "Speakers & Audio >",
        links: [
          { title: "Bluetooth & Wireless Speakers", path: "/product/69667a55081e46fbb391cf01" },
          { title: "Campfire Bluetooth Speakers", path: "/product/69667a55081e46fbb391cf01" },
          { title: "Technologycally Advanced Bluetooth Speakers", path: "/product/69667a55081e46fbb391cf01" },
        ],
      },
      {
        heading: "Fans >",
        links: [
          { title: "Technologically Advanced Fans", path: "/product/69667e5c081e46fbb391cf42" },
          { title: "Bladeless Fans", path: "/product/69667e5c081e46fbb391cf42" },
          { title: "Musical Fans", path: "/product/69667e5c081e46fbb391cf42" },
        ],
      },
      {
        heading: "Digital Photo Frames >",
        links: [
          { title: "Digital Photo Frames", path: "/product/69667a55081e46fbb391cf00" },
        ],
      },
      {
        heading: "Kids Tech and Electronics >",
        links: [
          { title: "Kids Robot", path: "/product/69667a55081e46fbb391cefc" },
          { title: "Technologically Advanced Robots", path: "/product/69667a55081e46fbb391cefc" },
        ],
      },
      {
        heading: "New & Trending >",
        links: [
          { title: "New Arrivals In Electronics", path: "#" },
          { title: "Contemporary Trending", path: "#" },
          { title: "New Electronics Designs", path: "#" },
          { title: "Trending Colors Designs", path: "#" },
        ],
      },
    ],
  },
   {
    title: "Bags And Accessories",
    path: "/category/accessories",
    megaMenu: [
      {
        heading: "Bags And Accessories >",
        links: [
          { title: "Jute Bags", path: "/product/69667a55081e46fbb391cf08" },
          { title: "Evening Clutches", path: "/category/accessories/clutch" },
          { title: "Designer Bags", path: "/category/accessories" },
        ],
      },
      {
        heading: "New & Trending >",
        links: [
          { title: "New Arrivals In Clutches", path: "#" },
          { title: "Contemporary Trending", path: "#" },
          { title: "New Fashion Desings", path: "#" },
          { title: "Trending Colors Desings", path: "#" },
        ],
      },
    ],
  },
  {
    title: "Business To Business",
    path: "/business-to-business",
    megaMenu: [
      {
        heading: "Business To Business >",
        links: [
          { title: "Invester Relations", path: "/women/clothing/womens-wear" },
          { title: "Inventry Details", path: "#" },
          { title: "Digital Purchase Order", path: "#" },
          { title: "Latest Updates", path: "#" },
        ],
      },
    ],
  },
];

// Top utility links
const topLinks = [
  { title: "About Us", path: "/about" },
  { title: "Add to Purchase Order", path: "/purchase-order-summary" },
  { title: "Gift Cards", path: "#" },
  { title: "Sign In", path: "/signin" },
  { title: "Contact Us", path: "/contact" },
];

   return (
    <header>
      {/* Top Utility Navigation */}
      <div className="top-nav">
        <div className="container">
          <ul>
            {topLinks.map((link, i) => (
              <li key={i}>
                <Link to={link.path}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="navbar">
        <div className="logo">
          <Link to="/"><img src="/images/logo.png" alt="logo" className="logo" /></Link>
        </div>

        <ul className="menu">
          {menuData.map((menu, i) => (
            <li key={i} className="menu-item">
              <Link to={menu.path} className="menu-title">
                {menu.title}
              </Link>

              {/* Mega Menu */}
              <div className="mega-menu">
                {menu.megaMenu.map((section, idx) => (
                  <div key={idx} className="mega-section">
                    <h4>{section.heading}</h4>
                    <ul>
                      {section.links.map((link, k) => (
                        <li key={k}>
                          <Link to={link.path}>{link.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
