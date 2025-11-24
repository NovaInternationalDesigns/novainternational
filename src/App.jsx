import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import './App.css'
import Navbar from "./Components/navbar/Navbar";
import Home from './pages/Home'
import Categories from './Components/Categories';
import Carousel from './Components/Carousel/Carousel';
import Footer from './Components/footer/Footer';
import Product from './pages/Product';


function App() {

  return (
     <BrowserRouter>
      <Navbar />   {/* always visible */}
      <Routes>
        {/* Home Page */}
        <Route path="/" element={
            <>
              <Carousel />
              <Categories />
            </>
          } 
        />

        {/* Product Page */}
        <Route path="/product" element={<Product />} />
      </Routes>

      <Footer />   {/* always visible */}
    </BrowserRouter>
  )
}

export default App
