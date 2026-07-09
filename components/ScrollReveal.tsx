"use client";

import { useEffect } from "react";

/**
 * Adds the `in` class to every `.reveal` element as it scrolls into view.
 * Mirrors the reveal behaviour of the original static page.
 *
 * Uses threshold 0 (reveal as soon as any part is visible) so that sections
 * taller than the viewport still reveal — a positive threshold can never be
 * reached when the element is bigger than the visible area. A load-time
 * fallback guarantees content is never left permanently hidden.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (els.length === 0) return;

    const reveal = (el: Element) => el.classList.add("in");

    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );
    els.forEach((el) => io.observe(el));

    // Safety net: anything still hidden a moment after load gets revealed,
    // so the page can never end up stuck at opacity 0.
    const fallback = window.setTimeout(() => {
      els.forEach((el) => {
        if (!el.classList.contains("in")) reveal(el);
      });
    }, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return null;
}
