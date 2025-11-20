import React from "react";
import "./Carousel.css";

const Carousel = () => {

    const images = [
    "./robot.png",
    "./light.png",
    "./vaccum-sealing-machine.png",
    "./digital-photoframe.png",
    "./light.png",
  ];

    return (
    <div className="carousel">
      <div className="slides">
        {images.map((img, index) => (
          <img key={index} src={img} alt={`Slide ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}


export default Carousel;