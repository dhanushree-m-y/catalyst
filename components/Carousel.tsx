"use client";

import { useEffect, useState } from "react";

export default function Carousel({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const t = window.setInterval(() => setI((v) => (v + 1) % images.length), 4500);
    return () => window.clearInterval(t);
  }, [paused, images.length]);

  const go = (n: number) => setI((n + images.length) % images.length);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="carousel-track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {images.map((src, idx) => (
          <div className="carousel-slide" key={src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={idx === 0 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>

      <button className="carousel-arrow prev" onClick={() => go(i - 1)} aria-label="Previous">
        ‹
      </button>
      <button className="carousel-arrow next" onClick={() => go(i + 1)} aria-label="Next">
        ›
      </button>

      <div className="carousel-dots">
        {images.map((src, idx) => (
          <button
            key={src}
            className={`carousel-dot${idx === i ? " active" : ""}`}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
