import React, { useState, useEffect, useRef } from "react";
import "./Carousel.css";

const Carousel = () => {
  const slides = [
    { type: "video", src: "./videos/SeasonsGreeting-2.mp4" },
    { type: "image", src: "./images/robot.png" },
    { type: "video", src: "./videos/campfire-speaker-black-logo.mp4" },
    { type: "image", src: "./images/light.png" },
    { type: "video", src: "./videos/Robot-final.mp4" },
    { type: "image", src: "./images/digital-photoframe.png" },
  ];

  // Clone first and last slide for seamless loop
  const extendedSlides = [
    slides[slides.length - 1],
    ...slides,
    slides[0],
  ];

  const [index, setIndex] = useState(1); // start at first real slide
  const [transition, setTransition] = useState(true);
  const timeoutRef = useRef(null);

  const delay = 3000;

  const goNext = () => setIndex((prev) => prev + 1);
  const goPrev = () => setIndex((prev) => prev - 1);

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  // Auto-slide for images only
  useEffect(() => {
    resetTimeout();
    const currentSlide = extendedSlides[index];

    if (currentSlide.type === "image") {
      timeoutRef.current = setTimeout(goNext, delay);
    }

    return () => resetTimeout();
  }, [index]);

  // Handle seamless loop
  const handleTransitionEnd = () => {
    // If moved to cloned last slide (index 0), jump to real last slide
    if (index === 0) {
      setTransition(false);
      setIndex(slides.length);
    }
    // If moved to cloned first slide (index = extendedSlides.length - 1), jump to real first slide
    if (index === extendedSlides.length - 1) {
      setTransition(false);
      setIndex(1);
    }
  };

  // Re-enable transition after jump
  useEffect(() => {
    if (!transition) {
      setTimeout(() => setTransition(true), 20);
    }
  }, [transition]);

  return (
    <div className="carousel-container">
      {/* SLIDES */}
      <div
        className="carousel-inner"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: transition ? "transform 0.5s ease" : "none",
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {extendedSlides.map((slide, i) => (
          <div className="carousel-item" key={i}>
            {slide.type === "image" ? (
              <img src={slide.src} alt={`Slide ${i}`} />
            ) : (
              <video
                src={slide.src}
                muted
                autoPlay
                playsInline
                onEnded={goNext}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />

            // For video with sonund controls.
            //   <video
            //   src={slide.src}
            //   autoPlay
            //   controls   // optional, shows play/pause + volume
            //   playsInline
            //   onEnded={goNext}
            //   style={{ width: "100%", height: "100%", objectFit: "contain" }}
            // />
            )}
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <button className="arrow left" onClick={goPrev}>
        ❮
      </button>
      <button className="arrow right" onClick={goNext}>
        ❯
      </button>

      {/* DOTS */}
      <div className="dots">
        {slides.map((_, i) => {
          // Adjust dot index because we have a cloned slide at start
          const dotIndex = i + 1;
          return (
            <div
              key={i}
              className={`dot ${index === dotIndex ? "active" : ""}`}
              onClick={() => setIndex(dotIndex)}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
