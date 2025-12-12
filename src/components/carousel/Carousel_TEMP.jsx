import React, { useState, useEffect, useRef } from "react";
import "./carousel.css";

const Carousel = () => {
  const slides = [
    { type: "video", src: "./videos/SeasonsGreeting3.mp4" },
    { type: "image", src: "./images/vaccum-sealing-machine-by-Nova-International-Designs-Corporation.png" },
    { type: "video", src: "./videos/Robot-final.mp4" },
    { type: "image", src: "./images/red-clutch.png" },
    { type: "image", src: "./images/robot.png" },
    { type: "video", src: "./videos/campfire-speaker-black-logo.mp4" },
    { type: "image", src: "./images/black-clutch.png" },
    { type: "image", src: "./images/light.png" },
    { type: "image", src: "./images/golden-clutch.png" },
    { type: "image", src: "./images/magenta-clutch2.png" },
    { type: "image", src: "./images/digital-photoframe.png" },
    { type: "image", src: "./images/gittery-gold-clutch.png" },
    { type: "image", src: "./images/silver-clutch.png" },
  ];

  // Clone first and last slide for seamless loop
  const extendedSlides = [slides[slides.length - 1], ...slides, slides[0]];

  const [index, setIndex] = useState(1); // Start at first real slide
  const [transition, setTransition] = useState(true);
  const timeoutRef = useRef(null);
  const videoRefs = useRef([]);

  const delay = 3000;

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const goNext = () => setIndex((prev) => prev + 1);
  const goPrev = () => setIndex((prev) => prev - 1);

  // Pause all videos
  const pauseAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video && !video.paused) {
        video.pause();
        video.currentTime = 0; // optional: reset to start
      }
    });
  };

  // Auto-slide for images only & play video when it becomes active
  useEffect(() => {
    pauseAllVideos(); // Stop any previous video

    const currentSlide = extendedSlides[index];

    if (currentSlide.type === "image") {
      timeoutRef.current = setTimeout(goNext, delay);
    } else if (currentSlide.type === "video") {
      const video = videoRefs.current[index];
      if (video) {
        video.currentTime = 0;
        video.play();
      }
    }

    return () => resetTimeout();
  }, [index]);

  // Handle seamless loop
  const handleTransitionEnd = () => {
    if (index === 0) {
      setTransition(false);
      setIndex(slides.length);
    } else if (index === extendedSlides.length - 1) {
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
                ref={(el) => (videoRefs.current[i] = el)}
                src={slide.src}
                controls
                onEnded={goNext}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            )}
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <button
        className="arrow left"
        onClick={() => {
          pauseAllVideos();
          goPrev();
        }}
      >
        ❮
      </button>
      <button
        className="arrow right"
        onClick={() => {
          pauseAllVideos();
          goNext();
        }}
      >
        ❯
      </button>

      {/* DOTS */}
      <div className="dots">
        {slides.map((_, i) => {
          const dotIndex = i + 1; // Adjust for cloned slide
          return (
            <div
              key={i}
              className={`dot ${index === dotIndex ? "active" : ""}`}
              onClick={() => {
                pauseAllVideos();
                setIndex(dotIndex);
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
