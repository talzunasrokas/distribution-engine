"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect } from "react";

/* ── Single animated orb ── */
interface OrbProps {
  color: string;
  w: number;
  h: number;
  left: string;
  top: string;
  blur: number;
  duration: number;
  delay: number;
  xRange: string[];
  yRange: string[];
}

function Orb({ color, w, h, left, top, blur, duration, delay, xRange, yRange }: OrbProps) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute"
      style={{
        width:      w,
        height:     h,
        left,
        top,
        translateX: "-50%",
        translateY: "-50%",
        background: `radial-gradient(ellipse, ${color}, transparent 70%)`,
        filter:     `blur(${blur}px)`,
        willChange: "transform",
      }}
      animate={{ x: xRange, y: yRange, scale: [1, 1.12, 0.94, 1.08, 1] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ── Exported component ── */
export default function NoiseBackground() {
  /* ── Mouse tracking ── */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Slow, heavy spring — feels premium, never snappy
  const springX = useSpring(rawX, { stiffness: 40, damping: 20, mass: 1.4 });
  const springY = useSpring(rawY, { stiffness: 40, damping: 20, mass: 1.4 });

  // Different parallax depths — each orb layer moves a different amount
  const x1 = useTransform(springX, v => v * 0.022);
  const y1 = useTransform(springY, v => v * 0.022);
  const x2 = useTransform(springX, v => v * -0.016);
  const y2 = useTransform(springY, v => v * -0.016);
  const x3 = useTransform(springX, v => v * 0.010);
  const y3 = useTransform(springY, v => v * 0.010);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      rawX.set(e.clientX - window.innerWidth  / 2);
      rawY.set(e.clientY - window.innerHeight / 2);
    }
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Slow-morphing mesh gradient layer */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(ellipse 120% 80% at 20% 30%, rgba(59,130,246,0.05) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 50% 80%, rgba(79,70,229,0.025) 0%, transparent 55%)",
            "radial-gradient(ellipse 110% 90% at 35% 20%, rgba(99,102,241,0.045) 0%, transparent 58%), radial-gradient(ellipse 120% 70% at 70% 35%, rgba(59,130,246,0.05) 0%, transparent 60%), radial-gradient(ellipse 80% 70% at 30% 75%, rgba(139,92,246,0.035) 0%, transparent 52%)",
            "radial-gradient(ellipse 130% 75% at 60% 25%, rgba(139,92,246,0.045) 0%, transparent 60%), radial-gradient(ellipse 90% 80% at 15% 55%, rgba(59,130,246,0.04) 0%, transparent 55%), radial-gradient(ellipse 100% 65% at 75% 70%, rgba(79,70,229,0.025) 0%, transparent 55%)",
            "radial-gradient(ellipse 120% 80% at 20% 30%, rgba(59,130,246,0.05) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 80% 20%, rgba(139,92,246,0.04) 0%, transparent 55%), radial-gradient(ellipse 90% 60% at 50% 80%, rgba(79,70,229,0.025) 0%, transparent 55%)",
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 1 — large blue, upper-left | deepest parallax layer */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: x1, y: y1 }}>
        <Orb
          color="rgba(59,130,246,0.10)"
          w={950} h={700}
          left="18%" top="22%"
          blur={110}
          duration={20} delay={0}
          xRange={["0%", "6%", "-4%", "3%", "0%"]}
          yRange={["0%", "-7%", "5%", "-3%", "0%"]}
        />
      </motion.div>

      {/* Orb 2 — purple, upper-right | mid parallax, opposite direction */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: x2, y: y2 }}>
        <Orb
          color="rgba(139,92,246,0.08)"
          w={850} h={650}
          left="78%" top="18%"
          blur={100}
          duration={25} delay={4}
          xRange={["0%", "-5%", "4%", "-2%", "0%"]}
          yRange={["0%", "6%", "-4%", "3%", "0%"]}
        />
      </motion.div>

      {/* Orb 3 — deep indigo, centre-bottom | shallowest parallax */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ x: x3, y: y3 }}>
        <Orb
          color="rgba(79,70,229,0.06)"
          w={750} h={550}
          left="52%" top="68%"
          blur={120}
          duration={30} delay={8}
          xRange={["0%", "4%", "-6%", "2%", "0%"]}
          yRange={["0%", "-5%", "3%", "-4%", "0%"]}
        />
      </motion.div>
    </div>
  );
}
