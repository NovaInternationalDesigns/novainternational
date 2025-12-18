import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from "react";
import "./App.css";

/* Components */
import Navbar from "./components/navbar/Navbar.jsx";
import Carousel from "./components/carousel/Carousel.jsx";
import Footer from "./components/footer/Footer.jsx";

/* Pages */
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Category from "./pages/Category.jsx";
import Product from "./features/products/Product.jsx";
import PurchaseOrderForm from "./pages/PurchaseOrderForm.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import DigitalLetterHead from './pages/DigitalLetterhead.jsx';
import Checkout from './pages/Checkout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import SignIn from './pages/SignIn.jsx';


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
        <Route path="/category/:category/:subcategory" element={<Category />} />

        <Route path="/digital-letter-head/:orderId" element={<DigitalLetterHead />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Checkout Page - Protected Route */} 
        <Route path="/checkout" element={
        <ProtectedRoute><Checkout /></ProtectedRoute>
  }
/>
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
