import React from 'react'
import './App.css'
import Navbar from "./Components/navbar/Navbar";
import Home from './pages/Home'
import Categories from './Components/Categories';
import Carousel from './Components/Carousel/Carousel';
import Footer from './Components/footer/Footer';


function App() {

  return (
    <>
      <Navbar />
      <Carousel />
      <Categories />
      <Footer />
    </>
  )
}

export default App
