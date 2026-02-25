"use client";

import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────
   Value-noise helpers
   ────────────────────────────────────────────────────────── */
function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

class ValueNoise {
  private table: Float32Array;
  private S = 256;

  constructor() {
    this.table = new Float32Array(this.S * this.S);
    for (let i = 0; i < this.table.length; i++) {
      this.table[i] = Math.random();
    }
  }

  sample(x: number, y: number): number {
    const S = this.S;
    const xi = Math.floor(x) & (S - 1);
    const yi = Math.floor(y) & (S - 1);
    const xf = smoothstep(x - Math.floor(x));
    const yf = smoothstep(y - Math.floor(y));
    const xi1 = (xi + 1) & (S - 1);
    const yi1 = (yi + 1) & (S - 1);
    const a = this.table[yi * S + xi];
    const b = this.table[yi * S + xi1];
    const c = this.table[yi1 * S + xi];
    const d = this.table[yi1 * S + xi1];
    const top = a + (b - a) * xf;
    const bot = c + (d - c) * xf;
    return top + (bot - top) * yf;
  }

  /** Fractional Brownian Motion — 4 octaves */
  fbm(x: number, y: number): number {
    let v = 0, amp = 0.5, freq = 1;
    for (let i = 0; i < 4; i++) {
      v += this.sample(x * freq, y * freq) * amp;
      amp *= 0.5;
      freq *= 2;
    }
    return v;
  }
}

/* ──────────────────────────────────────────────────────────
   Props
   ────────────────────────────────────────────────────────── */
interface SpectraNoiseProps {
  /** 0–1 overall opacity of the noise layer */
  opacity?: number;
  /** 0–1 intensity of the scanline overlay */
  scanlineOpacity?: number;
  /** Animation speed multiplier */
  speed?: number;
}

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */
export default function SpectraNoise({
  opacity = 0.55,
  scanlineOpacity = 0.08,
  speed = 1,
}: SpectraNoiseProps) {
  const noiseRef = useRef<HTMLCanvasElement>(null);
  const scanRef  = useRef<HTMLCanvasElement>(null);

  /* ── Scanline canvas (static, drawn once) ── */
  useEffect(() => {
    const canvas = scanRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth  || window.innerWidth;
    const H = canvas.offsetHeight || window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    for (let y = 0; y < H; y += 3) {
      ctx.fillStyle = `rgba(0,0,0,${scanlineOpacity})`;
      ctx.fillRect(0, y, W, 1);
    }
  }, [scanlineOpacity]);

  /* ── Noise canvas (animated) ── */
  useEffect(() => {
    const canvas = noiseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = 160;   // low-res — CSS scales it up (pixelated)
    const H = 160;
    canvas.width  = W;
    canvas.height = H;

    const noise = new ValueNoise();
    let t = 0;
    let tick = 0;
    let rafId: number;

    function draw() {
      rafId = requestAnimationFrame(draw);
      if (tick++ % 3 !== 0) return; // ~20 fps
      t += 0.004 * speed;

      const img = ctx!.createImageData(W, H);
      const d   = img.data;

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          // Two layers of fBm drifting at slightly different speeds
          const nx  = x / W * 3.5 + t * 0.4;
          const ny  = y / H * 3.5 + t * 0.25;
          const nx2 = x / W * 2.0 - t * 0.15;
          const ny2 = y / H * 2.0 + t * 0.35;

          const n1 = noise.fbm(nx,  ny);
          const n2 = noise.fbm(nx2, ny2);
          const n  = (n1 * 0.65 + n2 * 0.35);

          const i = (y * W + x) * 4;

          // Blue-dominant, purple undertone
          d[i]     = (n * 110) | 0;   // R — low
          d[i + 1] = (n *  30) | 0;   // G — very low
          d[i + 2] = (n * 255) | 0;   // B — full
          d[i + 3] = (n *  90) | 0;   // A — subtle
        }
      }

      ctx!.putImageData(img, 0, 0);
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  return (
    <>
      {/* Animated noise layer */}
      <canvas
        ref={noiseRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{
          imageRendering : "pixelated",
          mixBlendMode   : "screen",
          opacity,
        }}
      />
      {/* Static scanlines */}
      <canvas
        ref={scanRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ opacity: 1 }}
      />
    </>
  );
}
