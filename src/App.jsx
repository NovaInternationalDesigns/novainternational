import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";

/* Components */
import Navbar from "./Components/Navbar/Navbar";
import Carousel from "./Components/Carousel/Carousel";
import Footer from "./Components/Footer/Footer";

/* Pages */
import Home from "./pages/Home/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Category from "./pages/Category.jsx";



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Carousel />
            </>
          }
        />

        {/* About Page */}
        <Route path="/about" element={<About />} />

        {/* Contact Page */}
        <Route path="/contact" element={<Contact />} />

        {/* Category Page */}
        <Route path="/category/:category" element={<Category />} />

 

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
