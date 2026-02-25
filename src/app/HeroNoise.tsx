"use client";

import { useEffect, useRef } from "react";

export default function HeroNoise() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 256;
    canvas.width = SIZE;
    canvas.height = SIZE;

    let frame = 0;
    let rafId: number;

    function tick() {
      rafId = requestAnimationFrame(tick);
      // ~15 fps — subtle flicker without burning the CPU
      if (frame++ % 4 !== 0) return;

      const imageData = ctx!.createImageData(SIZE, SIZE);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        // Blue-dominant, faint purple shift
        d[i]     = (v * 0.18) | 0;  // R — low
        d[i + 1] = (v * 0.08) | 0;  // G — very low
        d[i + 2] = v;                // B — full
        d[i + 3] = (v * 0.10) | 0;  // A — keep it very subtle
      }

      ctx!.putImageData(imageData, 0, 0);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{
        imageRendering: "pixelated",
        opacity: 0.55,
        mixBlendMode: "screen",
      }}
    />
  );
}
