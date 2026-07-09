"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  max: number;
  rot: number;
  vr: number;
  color: string;
  star: boolean;
};

/**
 * Magic cursor: a trail of twinkling stars / stardust that spawns as the mouse
 * moves (more, and faster, the quicker you move), drifting up and fading out,
 * plus a soft glowing aura pinned to the cursor. Canvas-based for smoothness.
 * Disabled on touch and when the user prefers reduced motion.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const colors = ["#ec3e93", "#fdc4df"];
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const parts: Particle[] = [];
    let mx = w / 2;
    let my = h / 2;
    let lastX = mx;
    let lastY = my;
    let active = false;

    const spawn = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const star = Math.random() < 0.6;
        parts.push({
          x: x + rand(-7, 7),
          y: y + rand(-7, 7),
          vx: rand(-0.7, 0.7),
          vy: rand(-1.1, 0.1),
          size: star ? rand(4, 9) : rand(1.4, 3.4),
          life: 0,
          max: rand(600, 1200),
          rot: rand(0, Math.PI),
          vr: rand(-0.06, 0.06),
          color: colors[(Math.random() * colors.length) | 0],
          star,
        });
      }
      if (parts.length > 280) parts.splice(0, parts.length - 280);
    };

    // radial burst of sparkles (used on click + button hover)
    const burst = (x: number, y: number, n: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rand(1.4, 4.6);
        const star = Math.random() < 0.62;
        parts.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 0.6,
          size: star ? rand(4, 10) : rand(1.6, 3.6),
          life: 0,
          max: rand(500, 1000),
          rot: rand(0, Math.PI),
          vr: rand(-0.12, 0.12),
          color: colors[(Math.random() * colors.length) | 0],
          star,
        });
      }
      if (parts.length > 320) parts.splice(0, parts.length - 320);
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      active = true;
      const dist = Math.hypot(mx - lastX, my - lastY);
      spawn(mx, my, Math.min(5, 1 + ((dist / 12) | 0)));
      lastX = mx;
      lastY = my;
    };

    const onClick = (e: MouseEvent) => burst(e.clientX, e.clientY, 22);
    let lastHover: Element | null = null;
    const onOver = (e: Event) => {
      const t = (e.target as Element).closest?.(".btn, button");
      if (t && t !== lastHover) {
        lastHover = t;
        burst(mx, my, 10);
      } else if (!t) {
        lastHover = null;
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", resize);
    window.addEventListener("click", onClick);
    document.addEventListener("mouseover", onOver);

    const drawStar = (
      x: number,
      y: number,
      r: number,
      rot: number,
      alpha: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = r * 2.4;
      ctx.beginPath();
      const inner = r * 0.36;
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        ctx.lineTo(Math.cos(a + Math.PI / 4) * inner, Math.sin(a + Math.PI / 4) * inner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      const f = dt / 16;
      ctx.clearRect(0, 0, w, h);

      // soft aura at the cursor
      if (active) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 70);
        g.addColorStop(0, "rgba(236,62,147,0.12)");
        g.addColorStop(1, "rgba(236,62,147,0)");
        ctx.fillStyle = g;
        ctx.fillRect(mx - 70, my - 70, 140, 140);
      }

      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.max) {
          parts.splice(i, 1);
          continue;
        }
        const k = p.life / p.max;
        p.x += p.vx * f;
        p.y += p.vy * f;
        p.vy += 0.006 * f; // gentle gravity
        p.rot += p.vr * f;
        const alpha = Math.sin(k * Math.PI) * (p.star ? 0.95 : 0.8);
        const size = p.size * (1 - k * 0.25);
        if (p.star) {
          drawStar(p.x, p.y, size, p.rot, alpha, p.color);
        } else {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = size * 3;
          ctx.beginPath();
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      window.removeEventListener("click", onClick);
      document.removeEventListener("mouseover", onOver);
    };
  }, []);

  return <canvas ref={ref} className="cursor-canvas" aria-hidden="true" />;
}
