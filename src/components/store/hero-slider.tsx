"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  "https://i.postimg.cc/xjh1S823/Sans-titre-1440-x-880-px.png",
  "https://i.postimg.cc/vTc7xBqQ/pexels-cottonbro-7565160.jpg",
];

const INTERVAL = 5000; // ms per slide

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % SLIDES.length);
        setTransitioning(false);
      }, 700); // fade duration
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Slides */}
      {SLIDES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700"
          style={{
            opacity: i === current ? (transitioning ? 0 : 1) : 0,
          }}
        />
      ))}

      {/* Gradient overlay — keeps left text readable, fades out on right */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "linear-gradient(to right, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.40) 50%, rgba(10,10,10,0.18) 100%)",
            "linear-gradient(to top, rgba(10,10,10,0.35) 0%, transparent 50%)",
          ].join(", "),
        }}
      />

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => { setTransitioning(false); setCurrent(i); }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "w-6 bg-white" : "w-1.5 bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
