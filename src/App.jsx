import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from "react";
import "./App.css";

/* Components */
import Navbar from "./components/navbar/Navbar.jsx";
import Carousel from "./components/carousel/Carousel.jsx";
import Footer from "./components/footer/Footer.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx';

/* Pages */
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Category from "./pages/Category.jsx";
import Product from "./features/products/Product.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import PurchaseOrderForm from "./pages/PurchaseOrderForm.jsx";
import DigitalLetterHead from './pages/DigitalLetterhead.jsx';
import Checkout from './pages/Checkout.jsx';
import SignIn from './pages/SignIn.jsx';
import PurchaseOrderSummary from './pages/PurchaseOrderSummary.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Carousel />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Product />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/category/:category" element={<Category />} />
        <Route path="/digital-letter-head/:orderId" element={<DigitalLetterHead />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Protected Routes */}
        <Route path="/purchase-order" element={<ProtectedRoute><PurchaseOrderForm /></ProtectedRoute>} />
        <Route path="/purchase-order-summary" element={<ProtectedRoute><PurchaseOrderSummary /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
