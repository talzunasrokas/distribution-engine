"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "idle" | "dragging" | "uploading" | "processing" | "done";

const LOOP: [Phase, number][] = [
  ["idle",       800],
  ["dragging",   1400],
  ["uploading",  250],
  ["processing", 350],
  ["done",       7400],
];

const PLATFORMS = [
  { name: "TikTok",    color: "#4f8ef7", accent: "rgba(79,142,247,0.12)" },
  { name: "IG Feed",   color: "#8b5cf6", accent: "rgba(139,92,246,0.12)" },
  { name: "YT Shorts", color: "#6366f1", accent: "rgba(99,102,241,0.12)" },
  { name: "FB Reels",  color: "#4f8ef7", accent: "rgba(79,142,247,0.12)" },
];


/* ── Cursor ──────────────────────────────────────────────── */
function CursorGlyph() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
      <path d="M0 0L0 16L4.5 11.5L7 18L9 17L6.5 10.5H12L0 0Z"
        fill="white" stroke="#0b0f14" strokeWidth="1" />
    </svg>
  );
}

function AnimatedCursor({
  phase,
  dropTarget,
}: {
  phase: Phase;
  dropTarget: { left: string; top: string };
}) {
  const show = phase === "idle" || phase === "dragging";
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="cursor"
          className="pointer-events-none absolute z-30 flex flex-col items-start"
          initial={{ left: "10%", top: "76%", opacity: 0 }}
          animate={{
            left:    phase === "dragging" ? dropTarget.left : "10%",
            top:     phase === "dragging" ? dropTarget.top  : "76%",
            opacity: 1,
          }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={
            phase === "dragging"
              ? { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }
              : { duration: 0 }
          }
        >
          <CursorGlyph />
          <div className="mt-0.5 ml-3.5 flex items-center gap-1.5 rounded-md border border-white/20 bg-[#131b2b] px-2 py-1 shadow-lg">
            <div className="h-3 w-3 rounded-sm bg-[#4f8ef7]/60 flex items-center justify-center flex-shrink-0">
              <div className="h-1.5 w-1 bg-white/70 rounded-[1px]" />
            </div>
            <span className="text-[9px] font-semibold text-white/80 whitespace-nowrap">
              video.mp4
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Upload Zone ─────────────────────────────────────────── */
function UploadZone({
  phase,
  dropRef,
}: {
  phase: Phase;
  dropRef: React.RefObject<HTMLDivElement>;
}) {
  const isDragging = phase === "dragging";
  const isDone     = phase === "done";

  return (
    <div ref={dropRef} className="w-full max-w-[400px]">
      <motion.div
        className="rounded-2xl border-2 w-full"
        style={{
          borderStyle: "dashed",
          minHeight: 138,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        animate={{
          borderColor: isDragging
            ? "rgba(79,142,247,0.75)"
            : isDone
            ? "rgba(74,222,128,0.50)"
            : "rgba(255,255,255,0.09)",
          backgroundColor: isDragging
            ? "rgba(79,142,247,0.07)"
            : isDone
            ? "rgba(74,222,128,0.04)"
            : "rgba(255,255,255,0.02)",
        }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {phase === "idle" && (
            <motion.div key="idle"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/[0.04] flex items-center justify-center">
                <svg className="h-5 w-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-[12px] font-semibold text-white/40">Drop video here</p>
              <p className="text-[10px] text-white/20">or click to browse</p>
            </motion.div>
          )}

          {phase === "dragging" && (
            <motion.div key="dragging"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <div className="h-10 w-10 rounded-xl border border-[#4f8ef7]/50 bg-[#4f8ef7]/10 flex items-center justify-center">
                <svg className="h-5 w-5 text-[#4f8ef7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <p className="text-[12px] font-semibold text-[#4f8ef7]">Release to upload</p>
              <p className="text-[10px] text-[#4f8ef7]/50">video.mp4 · ready</p>
            </motion.div>
          )}

          {phase === "uploading" && (
            <motion.div key="uploading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center gap-3 py-1 w-[260px]"
            >
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-sm bg-[#4f8ef7]/60 flex-shrink-0" />
                <span className="text-[11px] font-semibold text-white/70">video.mp4</span>
              </div>
              <div className="w-full rounded-full bg-white/[0.06] h-1.5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#4f8ef7]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.22, ease: "linear" }}
                />
              </div>
              <p className="text-[10px] text-white/35">Uploading…</p>
            </motion.div>
          )}

          {phase === "processing" && (
            <motion.div key="processing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <svg className="h-8 w-8 text-[#8b5cf6]" viewBox="0 0 24 24" fill="none">
                <motion.circle
                  cx="12" cy="12" r="9"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                  strokeDasharray="0.6 0.4"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.55, repeat: Infinity, ease: "linear" }}
                  style={{ originX: "12px", originY: "12px" }}
                />
              </svg>
              <p className="text-[11px] font-semibold text-white/50">Processing…</p>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="done"
              initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 22 }}
              className="flex flex-col items-center gap-2 py-1"
            >
              <div className="h-10 w-10 rounded-full border border-green-400/40 bg-green-400/10 flex items-center justify-center">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[12px] font-semibold text-green-400">Ready to distribute</p>
              <p className="text-[10px] text-white/30">4 outputs generated</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ── Instagram Feed Card — LIGHT MODE ────────────────────── */
function IGFeedCard() {
  const IG_GRAD = "linear-gradient(45deg,#f09433 0%,#e6683c 20%,#dc2743 45%,#cc2366 70%,#bc1888 100%)";
  const ICON_COLOR = "#262626";

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden text-[12px] leading-[1.25]" style={{ background: "#ffffff" }}>

      {/* Pacifico font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');`}</style>

      {/* Top bar */}
      <div className="flex items-center justify-between px-2 pt-[5px] pb-[3px] flex-shrink-0"
        style={{ borderBottom: "0.5px solid #dbdbdb" }}>
        <span style={{
          fontFamily: "'Pacifico', 'Brush Script MT', cursive",
          fontSize: "9px",
          color: "#262626",
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}>
          Instagram
        </span>
        <div className="flex items-center gap-[5px]">
          {/* Heart */}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          {/* Paper-plane DM */}
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={ICON_COLOR} strokeWidth="1.75"
            strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </div>
      </div>

      {/* Stories row */}
      <div className="flex items-start gap-[4px] px-2 py-[5px] flex-shrink-0"
        style={{ borderBottom: "0.5px solid #efefef" }}>
        {/* Your story */}
        <div className="flex flex-col items-center gap-[2px] flex-shrink-0">
          <div style={{ position: "relative", width: 20, height: 20 }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              border: "1px solid #dbdbdb",
              background: "#efefef",
            }} />
            <div style={{
              position: "absolute", bottom: -1, right: -1,
              width: 7, height: 7, borderRadius: "50%",
              background: "#0095f6",
              border: "1.5px solid white",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="3.5" height="3.5" viewBox="0 0 8 8">
                <line x1="4" y1="1" x2="4" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <line x1="1" y1="4" x2="7" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <span style={{ fontSize: "4px", color: "#8e8e8e", lineHeight: 1, whiteSpace: "nowrap" }}>Your story</span>
        </div>
        {/* Other stories with IG gradient ring */}
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center gap-[2px] flex-shrink-0">
            <div style={{ width: 20, height: 20, borderRadius: "50%", padding: "1.5px", background: IG_GRAD }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#f8f8f8", border: "1.5px solid white" }} />
            </div>
            <span style={{ fontSize: "4px", color: "#8e8e8e", lineHeight: 1 }}>user{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Post header */}
      <div className="flex items-center justify-between px-2 py-[4px] flex-shrink-0">
        <div className="flex items-center gap-[4px]">
          {/* Avatar with gradient ring */}
          <div style={{ width: 15, height: 15, borderRadius: "50%", padding: "1.5px", background: IG_GRAD, flexShrink: 0 }}>
            <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#d4a8c7", border: "1.5px solid white" }} />
          </div>
          <span style={{ fontSize: "6.5px", fontWeight: 700, color: "#262626" }}>yourhandle</span>
          <span style={{ fontSize: "6px", color: "#8e8e8e" }}>• 2h</span>
        </div>
        {/* Three dots */}
        <svg width="10" height="10" viewBox="0 0 24 24" fill={ICON_COLOR}>
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
      </div>

      {/* 1:1 square video */}
      <div className="w-full flex justify-center flex-shrink-0">
        <div className="w-full aspect-square relative overflow-hidden bg-black">
          <video
            src="/videos/instagram.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Action bar + likes/caption */}
      <div className="w-full bg-white border-t border-black/10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button type="button" className="p-0 m-0 inline-flex items-center justify-center text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block w-[22px] h-[22px] shrink-0"
                style={{ width: 22, height: 22 }}
              >
                <path d="M12 21s-7-4.35-7-10a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5.65-7 10-7 10z" />
              </svg>
            </button>
            <button type="button" className="p-0 m-0 inline-flex items-center justify-center text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block w-[22px] h-[22px] shrink-0"
                style={{ width: 22, height: 22 }}
              >
                <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
              </svg>
            </button>
            <button type="button" className="p-0 m-0 inline-flex items-center justify-center text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="block w-[22px] h-[22px] shrink-0"
                style={{ width: 22, height: 22 }}
              >
                <path d="M22 2L11 13" />
                <path d="M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
          <button type="button" className="p-0 m-0 inline-flex items-center justify-center text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="block w-[22px] h-[22px] shrink-0"
              style={{ width: 22, height: 22 }}
            >
              <path d="M5 3h14v18l-7-5-7 5V3z" />
            </svg>
          </button>
        </div>
        <div className="px-4 pb-4 !text-[12px] !leading-[1.25] text-black">
          <div className="m-0 p-0 font-semibold">1,234 likes</div>
          <div className="m-0 p-0 mt-1">
            <span className="font-semibold">yourhandle</span>
            <span className="text-black/60"> New video just dropped 🔥</span>
          </div>
        </div>
      </div>

    </div>
  );
}

/* ── TikTok Feed Card ────────────────────────────────────── */
function TikTokCard() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" style={{ borderRadius: "inherit" }}>
      {/* Background video */}
      <video
        src="/videos/instagram.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.12) 100%)",
      }} />

      {/* Top tabs */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-center gap-[6px] pt-[6px]">
        <span style={{ fontSize: "5.5px", color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Following</span>
        <div className="flex flex-col items-center gap-[1.5px]">
          <span style={{ fontSize: "5.5px", color: "#ffffff", fontWeight: 700 }}>For You</span>
          <div style={{ width: 14, height: 1, background: "white", borderRadius: 1 }} />
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute right-[5px] flex flex-col items-center gap-[8px]" style={{ bottom: 36 }}>
        {/* Profile avatar with + badge */}
        <div className="relative flex flex-col items-center" style={{ marginBottom: 6 }}>
          <div style={{
            width: 18, height: 18, borderRadius: "50%",
            background: "linear-gradient(135deg, #ff0050 0%, #00f2ea 100%)",
            border: "1.5px solid white",
          }} />
          <div style={{
            position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8, borderRadius: "50%",
            background: "#fe2c55",
            border: "1px solid white",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="4" height="4" viewBox="0 0 8 8">
              <line x1="4" y1="1" x2="4" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <line x1="1" y1="4" x2="7" y2="4" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Heart */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span style={{ fontSize: "5px", color: "white", lineHeight: 1 }}>128.4K</span>
        </div>

        {/* Comment */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
          </svg>
          <span style={{ fontSize: "5px", color: "white", lineHeight: 1 }}>2,134</span>
        </div>

        {/* Share */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          <span style={{ fontSize: "5px", color: "white", lineHeight: 1 }}>Share</span>
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 px-[6px] pb-[6px]" style={{ paddingRight: 28 }}>
        <div style={{ fontSize: "6px", fontWeight: 700, color: "white", lineHeight: 1.3 }}>@yourhandle</div>
        <div style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.3, marginTop: 1 }}>
          New video just dropped 🔥
        </div>
        <div style={{ fontSize: "5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.3, marginTop: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <svg width="5" height="5" viewBox="0 0 24 24" fill="white">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>Original sound — yourhandle</span>
        </div>
      </div>
    </div>
  );
}

/* ── YouTube Shorts Card ─────────────────────────────────── */
function YouTubeCard() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" style={{ borderRadius: "inherit" }}>
      <video
        src="/videos/instagram.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.12) 100%)",
      }} />

      {/* Top left: Shorts label */}
      <div className="absolute top-[6px] left-[5px] flex items-center gap-[3px]">
        <svg width="9" height="9" viewBox="0 0 24 24">
          <path fill="#ff0000" d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.19 8.19 0 004.79 1.53V6.77a4.85 4.85 0 01-1.02-.08z" />
        </svg>
        <span style={{ fontSize: "6px", color: "white", fontWeight: 700, lineHeight: 1 }}>Shorts</span>
      </div>

      {/* Top right: kebab menu */}
      <div className="absolute top-[6px] right-[5px]">
        <svg width="9" height="9" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </div>

      {/* Right action rail */}
      <div className="absolute right-[5px] flex flex-col items-center gap-[8px]" style={{ bottom: 40 }}>
        {/* Like */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>92K</span>
        </div>
        {/* Dislike */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </svg>
        </div>
        {/* Comment */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
          </svg>
          <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>1.2K</span>
        </div>
        {/* Share */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>Share</span>
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 px-[6px] pb-[6px]" style={{ paddingRight: 28 }}>
        <div style={{ fontSize: "6px", fontWeight: 700, color: "white", lineHeight: 1.3 }}>@yourhandle</div>
        <div style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.3, marginTop: 1 }}>
          Reformatted in one click.
        </div>
        <div style={{ fontSize: "5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.3, marginTop: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <svg width="5" height="5" viewBox="0 0 24 24" fill="white">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>Original audio</span>
        </div>
      </div>
    </div>
  );
}

/* ── Facebook Reels Card ─────────────────────────────────── */
function FBReelsCard() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black" style={{ borderRadius: "inherit" }}>
      <video
        src="/videos/instagram.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.12) 100%)",
      }} />

      {/* Top bar */}
      <div className="absolute top-[6px] left-[5px] right-[5px] flex items-center justify-between">
        <div className="flex items-center gap-[3px]">
          {/* Facebook f circle */}
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#1877f2",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="5" height="5" viewBox="0 0 10 10">
              <path d="M6.5 1.5H5.5C5.1 1.5 5 1.7 5 2v1h1.5l-.2 1.5H5V8H3.5V4.5H2.5V3H3.5V2C3.5 0.9 4.2 0 5.5 0H6.5V1.5Z"
                fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: "6px", color: "white", fontWeight: 700, lineHeight: 1 }}>Reels</span>
        </div>
        <div className="flex items-center gap-[4px]">
          {/* Search */}
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          {/* Camera */}
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 7l-7 5 7 5V7z" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        </div>
      </div>

      {/* Right action rail */}
      <div className="absolute right-[5px] flex flex-col items-center gap-[8px]" style={{ bottom: 40 }}>
        {/* Like */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>48K</span>
        </div>
        {/* Comment */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8z" />
          </svg>
          <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>803</span>
        </div>
        {/* Share */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13" />
            <path d="M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
          <span style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1 }}>Share</span>
        </div>
        {/* More */}
        <div className="flex flex-col items-center gap-[2px]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </div>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 px-[6px] pb-[6px]" style={{ paddingRight: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize: "6px", fontWeight: 700, color: "white", lineHeight: 1.3 }}>Your Page</span>
          {/* Verified badge */}
          <svg width="6" height="6" viewBox="0 0 24 24" fill="#1877f2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>
        <div style={{ fontSize: "5px", color: "rgba(255,255,255,0.85)", lineHeight: 1.3, marginTop: 1 }}>
          Auto-formatted for every platform.
        </div>
        <div style={{ fontSize: "5px", color: "rgba(255,255,255,0.65)", lineHeight: 1.3, marginTop: 3, display: "flex", alignItems: "center", gap: 2 }}>
          <svg width="5" height="5" viewBox="0 0 24 24" fill="white">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <span>Original audio</span>
        </div>
      </div>
    </div>
  );
}

/* ── Platform Icons ──────────────────────────────────────── */
function TikTokIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.79 1.53V6.77a4.85 4.85 0 0 1-1.02-.08z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.514c-1.491 0-1.956.93-1.956 1.886v2.264h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

/* ── Platform Section ────────────────────────────────────── */
function PlatformSection({ phase, platformGridRef }: { phase: Phase; platformGridRef?: React.RefObject<HTMLDivElement> }) {
  const isDone = phase === "done";

  return (
    <div className="w-full flex flex-col">
      <div ref={platformGridRef} className="grid grid-cols-4 gap-3 w-full">
        {PLATFORMS.map((p, i) => (
          <motion.div
            key={p.name}
            className="flex flex-col items-center gap-1.5"
            animate={{ opacity: isDone ? 1 : 0, y: isDone ? 0 : 8 }}
            transition={{ duration: 0.4, delay: isDone ? i * 0.09 : 0, ease: "easeOut" }}
          >
            {/* 9:16 outer frame */}
            <div
              className="w-full rounded-xl overflow-hidden border relative"
              style={{
                aspectRatio: "9 / 16",
                borderColor: p.name === "TikTok"    ? "rgba(0,0,0,0.5)"
                           : p.name === "IG Feed"   ? "#dbdbdb"
                           : p.name === "YT Shorts" ? "rgba(0,0,0,0.5)"
                           : p.name === "FB Reels"  ? "rgba(0,0,0,0.5)"
                           : `${p.color}38`,
                background:  p.name === "TikTok"    ? "#000000"
                           : p.name === "IG Feed"   ? "#ffffff"
                           : p.name === "YT Shorts" ? "#000000"
                           : p.name === "FB Reels"  ? "#000000"
                           : p.accent,
              }}
            >
              {p.name === "TikTok" ? (
                <TikTokCard />
              ) : p.name === "IG Feed" ? (
                <IGFeedCard />
              ) : p.name === "YT Shorts" ? (
                <YouTubeCard />
              ) : p.name === "FB Reels" ? (
                <FBReelsCard />
              ) : (
                <>
                  <div className="absolute inset-0"
                    style={{ background: `linear-gradient(165deg, ${p.color}22 0%, transparent 55%)` }} />
                  <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-2 pt-1.5 pb-1"
                    style={{ borderBottom: `1px solid ${p.color}18` }}>
                    <div className="flex items-center gap-0.5">
                      <div className="h-[3px] w-[3px] rounded-full" style={{ background: `${p.color}80` }} />
                      <div className="h-[3px] w-[3px] rounded-full" style={{ background: `${p.color}50` }} />
                    </div>
                    <div className="h-[3px] w-6 rounded-full" style={{ background: `${p.color}30` }} />
                    <div className="h-[3px] w-[3px] rounded-full" style={{ background: `${p.color}50` }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center" style={{ top: 20 }}>
                    <div className="rounded-full border flex items-center justify-center"
                      style={{ width: 28, height: 28, borderColor: `${p.color}50`, background: `${p.color}14` }}>
                      <div className="ml-px" style={{
                        width: 0, height: 0,
                        borderTop: "4px solid transparent",
                        borderBottom: "4px solid transparent",
                        borderLeft: `6px solid ${p.color}`,
                        opacity: 0.65,
                      }} />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center justify-center h-5">
              {p.name === "TikTok"    ? <TikTokIcon className="h-5 w-5 text-white/75" /> :
               p.name === "IG Feed"   ? <InstagramIcon className="h-5 w-5 text-white/75" /> :
               p.name === "YT Shorts" ? <YouTubeIcon className="h-5 w-5 text-white/75" /> :
               p.name === "FB Reels"  ? <FacebookIcon className="h-5 w-5 text-white/75" /> : null}
            </div>
            <div className="rounded-full px-1.5 py-0.5 text-[7px] font-bold"
              style={{ background: `${p.color}20`, color: p.color }}>
              Ready
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── Workflow Canvas ─────────────────────────────────────── */
function WorkflowCanvas({ phase }: { phase: Phase }) {
  const isDone    = phase === "done";
  const canvasRef = useRef<HTMLDivElement>(null);
  const dropRef   = useRef<HTMLDivElement>(null);
  const [dropTarget, setDropTarget] = useState({ left: "50%", top: "38%" });
  const platformGridRef = useRef<HTMLDivElement>(null);
  const connectorRef    = useRef<HTMLDivElement>(null);
  const [connectorLines, setConnectorLines] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  useEffect(() => {
    function measure() {
      const canvas = canvasRef.current;
      const drop   = dropRef.current;
      if (!canvas || !drop) return;
      const cRect = canvas.getBoundingClientRect();
      const dRect = drop.getBoundingClientRect();
      const cx = dRect.left + dRect.width  / 2 - cRect.left;
      const cy = dRect.top  + dRect.height / 2 - cRect.top;
      setDropTarget({
        left: `${(cx / cRect.width)  * 100}%`,
        top:  `${(cy / cRect.height) * 100}%`,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function measureLines() {
      const container = connectorRef.current;
      const drop      = dropRef.current;
      const grid      = platformGridRef.current;
      if (!container || !drop || !grid) return;
      const cRect  = container.getBoundingClientRect();
      const dRect  = drop.getBoundingClientRect();
      const gRect  = grid.getBoundingClientRect();
      const startX = dRect.left + dRect.width  / 2 - cRect.left;
      const startY = dRect.bottom - cRect.top;
      const colW   = gRect.width / 4;
      const endY   = gRect.top - cRect.top;
      setConnectorLines([0, 1, 2, 3].map(i => ({
        x1: startX,
        y1: startY,
        x2: gRect.left - cRect.left + colW * i + colW / 2,
        y2: endY,
      })));
    }
    measureLines();
    window.addEventListener("resize", measureLines);
    return () => window.removeEventListener("resize", measureLines);
  }, []);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-full flex flex-col items-center justify-center gap-6 px-6 overflow-hidden"
    >
      <AnimatedCursor phase={phase} dropTarget={dropTarget} />

      {/* Header */}
      <div className="flex items-center justify-between w-full flex-shrink-0">
        <div>
          <p className="text-[13px] font-bold text-white/70 leading-tight">New Publish</p>
          <p className="text-[10px] text-white/30 mt-0.5">Distribute to all platforms at once</p>
        </div>
        <div className="rounded-lg border border-[#4f8ef7]/30 bg-[#4f8ef7]/10 px-3 py-1.5 flex-shrink-0">
          <span className="text-[10px] font-bold text-[#4f8ef7]">+ Upload</span>
        </div>
      </div>

      {/* Drop zone + connector lines + platform cards */}
      <div ref={connectorRef} className="relative w-full flex flex-col items-center gap-6">
        {connectorLines.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible z-10"
            style={{ width: "100%", height: "100%", filter: "drop-shadow(0 0 5px rgba(255,255,255,0.35))" }}
          >
            {connectorLines.map((ln, i) => (
              <motion.line
                key={i}
                x1={ln.x1} y1={ln.y1}
                x2={ln.x2} y2={ln.y2}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: isDone ? 1 : 0,
                  opacity:    isDone ? 1 : 0,
                }}
                transition={{
                  pathLength: { duration: 0.6, delay: isDone ? i * 0.08 : 0, ease: "easeOut" },
                  opacity:    { duration: 0.15, delay: isDone ? i * 0.08 : 0 },
                }}
              />
            ))}
          </svg>
        )}
        <UploadZone phase={phase} dropRef={dropRef} />
        <PlatformSection phase={phase} platformGridRef={platformGridRef} />
      </div>

      {/* CTA */}
      <div className="flex items-center justify-center w-full flex-shrink-0" style={{ height: 52 }}>
        <AnimatePresence>
          {isDone && (
            <motion.div
              key="cta"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6, transition: { duration: 0.2 } }}
              transition={{ duration: 0.45, delay: 0.6, ease: "easeOut" }}
            >
              <motion.button
                className="px-10 py-3 rounded-xl text-[13px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #4f8ef7 0%, #6366f1 100%)" }}
                animate={{
                  boxShadow: [
                    "0 0 24px rgba(79,142,247,0.50), 0 0 56px rgba(99,102,241,0.18)",
                    "0 0 42px rgba(79,142,247,0.85), 0 0 80px rgba(99,102,241,0.38)",
                    "0 0 24px rgba(79,142,247,0.50), 0 0 56px rgba(99,102,241,0.18)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Publish to all Platforms
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export function HeroDashboardVisual({ playId = 0 }: { playId?: number }) {
  const [phase, setPhase]   = useState<Phase>("idle");
  const timerRef            = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loopIndexRef        = useRef(1);
  const cancelledRef        = useRef(false);

  useEffect(() => {
    // Hard-cancel any in-flight timers from the previous run.
    cancelledRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");

    // playId === 0 is the pre-scroll initial state — don't start yet.
    if (playId === 0) return;

    let rafId: number;
    cancelledRef.current = false;
    loopIndexRef.current = 1; // skip initial idle, start at "dragging"

    function tick() {
      if (cancelledRef.current) return;
      const [nextPhase, duration] = LOOP[loopIndexRef.current % LOOP.length];
      setPhase(nextPhase);
      loopIndexRef.current++;
      timerRef.current = setTimeout(tick, duration);
    }

    // Wait one frame so the "idle" state reset has committed before starting.
    rafId = requestAnimationFrame(() => {
      if (!cancelledRef.current) tick();
    });

    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      cancelAnimationFrame(rafId);
    };
  }, [playId]);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", active: false },
    { label: "Analytics", active: false },
    { label: "Publish",   active: true  },
    { label: "Workflows", active: false },
    { label: "Settings",  active: false },
  ];

  return (
    <div
      className="h-[92vh] min-h-[760px] rounded-2xl border border-white/[0.09] bg-[#0d1420] shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0a1018] px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-white/25 font-medium">Distribution Machine</span>
        <div className="ml-auto flex items-center gap-2">
          <div className="h-1.5 w-16 rounded-full bg-white/[0.06]" />
          <div className="h-5 w-5 rounded bg-white/[0.04] border border-white/[0.07]" />
        </div>
      </div>

      <div className="flex h-[calc(100%-40px)]">
        {/* Sidebar */}
        <div className="hidden md:flex w-44 flex-shrink-0 flex-col border-r border-white/[0.06] bg-[#0a1018] p-4">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-6 w-6 rounded-md bg-[#4f8ef7] flex items-center justify-center">
              <div className="h-3 w-3 rounded-sm bg-white/90" />
            </div>
            <span className="text-[11px] font-bold text-white/60">Distribution</span>
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5">
            <svg className="h-3 w-3 flex-shrink-0 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] text-white/20">Search</span>
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 cursor-pointer ${
                  item.active ? "bg-[#4f8ef7]/15 text-[#4f8ef7]" : "text-white/30 hover:text-white/50"
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                  item.active ? "bg-[#4f8ef7]" : "bg-white/15"
                }`} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main animated content */}
        <div className="flex-1 overflow-hidden">
          <WorkflowCanvas phase={phase} />
        </div>
      </div>
    </div>
  );
}
