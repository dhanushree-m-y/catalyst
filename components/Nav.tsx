"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const LEFT: [string, string][] = [
  ["#about", "About"],
  ["/git-with-her", "Git With Her"],
  ["#community", "Community"],
];
const RIGHT: [string, string][] = [
  ["#upcoming", "Events"],
  ["#sponsors", "Sponsors"],
  ["#contact", "Contact"],
];
const ALL = [...LEFT, ...RIGHT];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scrollspy: highlight the nav link for the section currently in view
  useEffect(() => {
    const els = ALL.map(([h]) => document.getElementById(h.slice(1))).filter(
      (el): el is HTMLElement => !!el
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}${open ? " open" : ""}`}>
      <div className="nav-inner">
        <div className="nav-links nav-left">
          {LEFT.map(([href, label]) => (
            <a key={href} href={href} className={`#${active}` === href ? "active" : undefined}>
              {label}
            </a>
          ))}
        </div>

        <Logo />

        <div className="nav-links nav-right">
          {RIGHT.map(([href, label]) => (
            <a key={href} href={href} className={`#${active}` === href ? "active" : undefined}>
              {label}
            </a>
          ))}
        </div>

        <button
          className="menu-btn"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div className="nav-mobile">
        {ALL.map(([href, label]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
        <a
          href="#register"
          className="btn btn-primary"
          onClick={() => setOpen(false)}
        >
          Register
        </a>
      </div>
    </nav>
  );
}
