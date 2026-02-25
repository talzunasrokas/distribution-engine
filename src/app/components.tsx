"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

/* ─────────────── FADE-IN WRAPPER ─────────────── */
export function FadeIn({
  children,
  delay = 0,
  y = 24,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── BUTTON ─────────────── */
export function PrimaryButton({
  children,
  className = "",
  conic = true,
}: {
  children: React.ReactNode;
  className?: string;
  conic?: boolean;
}) {
  if (!conic) {
    return (
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: "0 0 32px rgba(79,142,247,0.45)" }}
        whileTap={{ scale: 0.97 }}
        className={`relative inline-flex items-center justify-center gap-2 rounded-xl bg-[#4f8ef7] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#4f8ef7]/20 transition-colors hover:bg-[#6aa0f9] ${className}`}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex rounded-xl p-px overflow-hidden ${className}`}
      style={{ isolation: "isolate" }}
    >
      {/* Rotating conic gradient border — white sweep */}
      <div
        className="conic-border-spin pointer-events-none absolute"
        style={{
          top: "50%", left: "50%",
          width: "220%", height: "220%",
          background:
            "conic-gradient(from 0deg, transparent 0%, transparent 32%, rgba(255,255,255,0.6) 48%, #ffffff 54%, rgba(255,255,255,0.6) 60%, transparent 76%, transparent 100%)",
        }}
      />
      {/* Wide outer glow */}
      <div
        className="conic-border-spin pointer-events-none absolute"
        style={{
          top: "50%", left: "50%",
          width: "220%", height: "220%",
          background:
            "conic-gradient(from 0deg, transparent 0%, transparent 32%, rgba(255,255,255,0.4) 48%, #ffffff 54%, rgba(255,255,255,0.4) 60%, transparent 76%, transparent 100%)",
          filter: "blur(16px)",
          opacity: 0.85,
        }}
      />
      {/* Tight crisp glow */}
      <div
        className="conic-border-spin pointer-events-none absolute"
        style={{
          top: "50%", left: "50%",
          width: "220%", height: "220%",
          background:
            "conic-gradient(from 0deg, transparent 0%, transparent 32%, rgba(255,255,255,0.5) 48%, #ffffff 54%, rgba(255,255,255,0.5) 60%, transparent 76%, transparent 100%)",
          filter: "blur(3px)",
          opacity: 1,
        }}
      />
      {/* Solid inner button */}
      <button className="relative z-10 inline-flex items-center justify-center gap-2 rounded-[11px] bg-[#4f8ef7] px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#6aa0f9]">
        {children}
      </button>
    </motion.div>
  );
}

/* ─────────────── GLASS CARD ─────────────── */
export function GlassCard({
  children,
  className = "",
  hover = true,
  conicBorder = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  conicBorder?: boolean;
}) {
  if (conicBorder) {
    return (
      <motion.div
        whileHover={hover ? { y: -4 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative inline-flex w-full h-full rounded-2xl p-px overflow-hidden shadow-xl"
        style={{ isolation: "isolate" }}
      >
        {/* Rotating conic gradient border — white sweep */}
        <div
          className="conic-border-spin pointer-events-none absolute"
          style={{
            top: "50%", left: "50%",
            width: "160%", height: "160%",
            background:
              "conic-gradient(from 0deg, transparent 0%, transparent 35%, rgba(255,255,255,0.5) 48%, #ffffff 54%, rgba(255,255,255,0.5) 62%, transparent 75%, transparent 100%)",
            animationDuration: "5s",
          }}
        />
        {/* Wide outer glow */}
        <div
          className="conic-border-spin pointer-events-none absolute"
          style={{
            top: "50%", left: "50%",
            width: "160%", height: "160%",
            background:
              "conic-gradient(from 0deg, transparent 0%, transparent 35%, rgba(255,255,255,0.35) 48%, #ffffff 54%, rgba(255,255,255,0.35) 62%, transparent 75%, transparent 100%)",
            filter: "blur(18px)",
            opacity: 0.8,
            animationDuration: "5s",
          }}
        />
        {/* Tight crisp glow */}
        <div
          className="conic-border-spin pointer-events-none absolute"
          style={{
            top: "50%", left: "50%",
            width: "160%", height: "160%",
            background:
              "conic-gradient(from 0deg, transparent 0%, transparent 35%, rgba(255,255,255,0.45) 48%, #ffffff 54%, rgba(255,255,255,0.45) 62%, transparent 75%, transparent 100%)",
            filter: "blur(4px)",
            opacity: 1,
            animationDuration: "5s",
          }}
        />
        {/* Inner card — solid bg blocks the spinning layers; only the 1px gap shows the border stroke */}
        <div className={`relative z-10 w-full h-full rounded-[15px] bg-[#111722] backdrop-blur-sm ${className}`}>
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: "0 24px 48px rgba(0,0,0,0.5)" } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────── SECTION LABEL ─────────────── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-4 inline-block rounded-full border border-[#4f8ef7]/30 bg-[#4f8ef7]/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-[#4f8ef7]">
      {children}
    </span>
  );
}

/* ─────────────── ACCORDION ─────────────── */
export function Accordion({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-white/[0.07] cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between py-5">
        <span className="text-base font-medium text-white/90">{question}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 flex-shrink-0 text-[#4f8ef7] text-xl font-light"
        >
          +
        </motion.span>
      </div>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-sm text-white/50 leading-relaxed">{answer}</p>
      </motion.div>
    </div>
  );
}

/* ─────────────── PLATFORM BADGE ─────────────── */
export function PlatformBadge({
  name,
  checked = true,
}: {
  name: string;
  checked?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.04] px-3 py-2">
      <span
        className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
          checked ? "bg-[#4f8ef7] text-white" : "bg-white/10 text-white/30"
        }`}
      >
        {checked ? "✓" : ""}
      </span>
      <span className="text-xs font-medium text-white/70">{name}</span>
    </div>
  );
}
