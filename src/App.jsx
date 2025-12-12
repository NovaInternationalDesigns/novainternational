import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from "react";
import "./App.css";

/* Components */
import Navbar from "./Components/navbar/Navbar.jsx";
import Carousel from "./Components/Carousel/Carousel.jsx";
// import Footer from "./Components/Footer/Footer.jsx";

/* Pages */
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Category from "./pages/Category.jsx";
import Product from "./features/products/Product.jsx";
import PurchaseOrderForm from "./pages/PurchaseOrderForm.jsx";
import ProductDetails from "./features/products/ProductDetails.jsx";
import DigitalLetterHead from './pages/DigitalLetterhead.jsx';



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route path="/" element={<Carousel />} />

        {/* About Page */}
        <Route path="/about" element={<About />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />
        
        {/* Product Page */}
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/purchase-order" element={<PurchaseOrderForm />} />

        {/* Category Page */}
        <Route path="/category/:category" element={<Category />} />

        <Route path="/digital-letter-head/:orderId" element={<DigitalLetterHead />} />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
