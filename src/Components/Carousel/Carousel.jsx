import React from "react";
import "./Carousel.css";

const Carousel = () => {

    const images = [
    "./images/robot.png",
    "./images/light.png",
    "./images/vaccum-sealing-machine.png",
    "./images/digital-photoframe.png",
    "./images/light.png",
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