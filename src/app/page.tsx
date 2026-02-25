"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FadeIn,
  PrimaryButton,
  GlassCard,
  SectionLabel,
  Accordion,
} from "./components";
import { HeroDashboardVisual } from "./HeroDashboardVisual";

/* ══════════════════════════════════════════════════════════
   INLINE SVG ICONS
══════════════════════════════════════════════════════════ */
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.74a4.85 4.85 0 0 1-1.01-.05z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const ZapierIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M14.785 11.218c-.23-.764-.546-1.496-.943-2.178l3.352-3.35-2.884-2.884-3.35 3.35c-.683-.397-1.415-.713-2.18-.942L8.152 1.5H4.148l-.628 3.714c-.764.23-1.496.546-2.178.943L.99 4.806l-.99.99 1.35 1.349A11.97 11.97 0 0 0 .406 9.324L.5 9.348v.004H0v4.004h.5l-.094.023c.2.852.51 1.665.916 2.424L.003 17.123l2.883 2.883 1.32-1.32c.758.406 1.57.715 2.422.916L6.648 24h4.004l.02-.094c.853-.2 1.667-.51 2.427-.917l1.32 1.32 2.883-2.883-1.318-1.318c.407-.76.716-1.573.917-2.427L24 17.355v-4.003h-.508l.094-.023c-.2-.852-.51-1.665-.916-2.424l1.32-1.32-2.883-2.883-1.322 1.516zM8.65 15.35A3.35 3.35 0 1 1 12 12a3.35 3.35 0 0 1-3.35 3.35z" />
  </svg>
);

const MetaIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M6.877 4C4.053 4 1 6.993 1 12.108c0 3.448 1.716 5.892 4.25 5.892 1.476 0 2.682-.7 4.074-2.698.831-1.2 1.62-2.748 2.676-4.872C13.255 7.79 14.61 6.12 16.504 6.12c1.36 0 2.54.801 3.36 2.053C20.651 9.406 21 11.016 21 12.108c0 1.83-.72 3.674-2.056 3.674-1.09 0-1.784-.942-1.784-2.34 0-.66.13-1.37.4-2.04H15c-.22.81-.334 1.64-.334 2.41 0 2.65 1.42 4.188 3.278 4.188C20.47 18 23 15.406 23 12.108 23 7.538 20.19 4 17.123 4c-1.97 0-3.556.97-4.94 2.88-.52.712-1.023 1.538-1.535 2.406C9.533 6.78 8.44 4 6.877 4z" />
  </svg>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

/* ══════════════════════════════════════════════════════════
   LOGO STRIP / MARQUEE
══════════════════════════════════════════════════════════ */
const logos = [
  { name: "TikTok", Icon: TikTokIcon },
  { name: "Instagram", Icon: InstagramIcon },
  { name: "YouTube", Icon: YouTubeIcon },
  { name: "Facebook", Icon: FacebookIcon },
  { name: "Meta", Icon: MetaIcon },
  { name: "Google", Icon: GoogleIcon },
  { name: "Zapier", Icon: ZapierIcon },
];

function MarqueeRow({ direction }: { direction: "left" | "right" }) {
  // Two copies is all that's needed: we translate -50% so the first copy
  // scrolls off exactly as the second copy snaps to the same position.
  const track = [...logos, ...logos, ...logos, ...logos];
  return (
    <div className="overflow-hidden py-2.5" aria-hidden="true">
      <div
        className={`flex items-center gap-14 ${
          direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
        }`}
        style={{ width: "max-content" }}
      >
        {track.map((logo, i) => (
          <div
            key={i}
            className="group flex flex-shrink-0 items-center gap-2.5 opacity-35 transition-opacity duration-400 hover:opacity-80"
          >
            <span className="text-white transition-colors duration-400">
              <logo.Icon />
            </span>
            <span className="text-sm font-semibold tracking-wide text-white">
              {logo.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD MOCKUP
══════════════════════════════════════════════════════════ */
function DashboardMockup() {
  const platforms = ["TikTok", "Reels", "Shorts", "Facebook Reels"];
  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#111722] shadow-2xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-4">
        <div className="h-3 w-3 rounded-full bg-red-500/60" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
        <div className="h-3 w-3 rounded-full bg-green-500/60" />
        <span className="ml-3 text-sm text-white/30 font-medium">Distribution Machine — Dashboard</span>
      </div>

      <div className="grid grid-cols-3 gap-0 divide-x divide-white/[0.06]">
        {/* LEFT: Upload */}
        <div className="p-7 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Upload</p>
          <div className="rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] py-10 px-6 text-center">
            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#4f8ef7]/20">
              <svg className="h-5 w-5 text-[#4f8ef7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xs text-white/40">Drop your video here</p>
            <p className="text-[11px] text-white/20 mt-1">MP4, MOV, AVI · max 2GB</p>
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Remove watermark</span>
              <div className="h-5 w-9 rounded-full bg-[#4f8ef7] relative flex-shrink-0">
                <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/50">Add Caption</span>
              <div className="h-5 w-9 rounded-full bg-white/[0.10] relative flex-shrink-0">
                <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white/40 shadow" />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE: Platforms */}
        <div className="p-7 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Platforms</p>
          <div className="space-y-2.5">
            {platforms.map((p) => (
              <div key={p} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.03] px-4 py-3">
                <span className="text-sm font-medium text-white/70">{p}</span>
                <div className="h-5 w-9 rounded-full bg-[#4f8ef7] relative flex-shrink-0">
                  <div className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow" />
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.03] p-4">
            <p className="text-xs text-white/30 mb-3">Format preview</p>
            <div className="flex gap-2.5 justify-center">
              {["9:16", "1:1", "16:9"].map((r) => (
                <button
                  key={r}
                  className={`rounded-md px-3 py-1.5 text-xs font-bold border ${
                    r === "9:16"
                      ? "bg-[#4f8ef7]/20 border-[#4f8ef7]/40 text-[#4f8ef7]"
                      : "border-white/[0.08] text-white/30"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Schedule & Publish */}
        <div className="p-7 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Schedule</p>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-4">
            <div className="flex justify-between mb-3">
              <span className="text-xs text-white/40">February 2026</span>
              <span className="text-xs text-[#4f8ef7]">›</span>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["M","T","W","T","F","S","S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] text-white/20">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                <div
                  key={d}
                  className={`text-center text-[10px] rounded py-0.5 ${
                    [7, 14, 21].includes(d)
                      ? "bg-[#4f8ef7]/30 text-[#4f8ef7] font-bold"
                      : d === 25
                      ? "bg-white/10 text-white/70"
                      : "text-white/20"
                  }`}
                >
                  {d}
                </div>
              ))}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 28px rgba(79,142,247,0.4)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full rounded-xl bg-[#4f8ef7] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#4f8ef7]/20"
          >
            Publish All
          </motion.button>
          <div className="space-y-2">
            {["TikTok · Ready", "Reels · Scheduled", "Shorts · Processing"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${item.includes("Ready") ? "bg-green-400" : item.includes("Scheduled") ? "bg-[#4f8ef7]" : "bg-yellow-400"}`} />
                <span className="text-xs text-white/40">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FEATURES SECTION
══════════════════════════════════════════════════════════ */
function LargeFeatureCard() {
  return (
    <GlassCard conicBorder className="p-4 h-full flex flex-col">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-2">Original Upload</p>
      {/* 9:16 video — fixed height so card stays compact */}
      <div className="relative rounded-xl overflow-hidden border border-white/[0.08] w-full flex-1 min-h-0" style={{ height: 320 }}>
        <video
          src="/videos/tiktok.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        {/* Top */}
        <div className="absolute top-3 left-0 right-0 flex justify-center">
          <span className="text-[10px] font-semibold text-white tracking-wide">For You</span>
        </div>
        {/* Right actions */}
        <div className="absolute bottom-14 right-2 flex flex-col items-center gap-3">
          <div className="flex flex-col items-center gap-0.5">
            <svg className="h-5 w-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-[8px] text-white/80 font-semibold">128K</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <svg className="h-5 w-5 text-white drop-shadow" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span className="text-[8px] text-white/80 font-semibold">2.1K</span>
          </div>
          <div className="flex flex-col items-center gap-0.5">
            <svg className="h-5 w-5 text-white drop-shadow" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
            </svg>
            <span className="text-[8px] text-white/80 font-semibold">Share</span>
          </div>
        </div>
        {/* Bottom handle + caption */}
        <div className="absolute bottom-3 left-2.5 right-9">
          <p className="text-[10px] font-bold text-white mb-0.5">@yourhandle</p>
          <p className="text-[9px] text-white/70 leading-tight line-clamp-2">Your original content ✨</p>
        </div>
        {/* Watermark */}
        <motion.div
          animate={{ opacity: [0.7, 0.15, 0.7] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-9 right-1.5 rounded px-1 py-0.5 text-[7px] font-bold text-white/60 border border-white/20 bg-black/20"
        >
          WATERMARK
        </motion.div>
      </div>
      <div className="flex items-center gap-2 text-[10px] text-white/30 mt-2">
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-400/60" />
        Raw · 1 file · 247 MB
      </div>
    </GlassCard>
  );
}


function DistributionCard() {
  const platforms = ["TikTok", "Instagram", "YouTube", "Facebook Reels"];
  return (
    <GlassCard conicBorder className="p-4 h-full flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#8b5cf6]/15">
          <svg className="h-4 w-4 text-[#8b5cf6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white">One-Click Distribution</h3>
      </div>
      <div className="space-y-1.5 flex-1 mb-3">
        {platforms.map((p) => (
          <div key={p} className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-white/[0.02] px-2.5 py-1">
            <span className="text-[11px] text-white/60">{p}</span>
            <span className="text-[10px] font-semibold text-green-400">✓</span>
          </div>
        ))}
      </div>
      <button className="mt-auto w-full rounded-lg border border-[#4f8ef7]/30 bg-[#4f8ef7]/10 py-1.5 text-xs font-semibold text-[#4f8ef7] hover:bg-[#4f8ef7]/20 transition-colors">
        See all features
      </button>
    </GlassCard>
  );
}

function WorkflowCard() {
  const steps = [
    { label: "Video Uploaded", type: "trigger" },
    { label: "Remove Watermark", type: "step" },
    { label: "Reformat", type: "step" },
    { label: "Generate Caption", type: "step" },
    { label: "Schedule", type: "step" },
    { label: "Publish", type: "end" },
  ];
  return (
    <GlassCard conicBorder className="p-4 h-full flex flex-col">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#4f8ef7]/15">
          <svg className="h-4 w-4 text-[#4f8ef7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white">Workflow Builder</h3>
      </div>
      <div className="space-y-1 flex-1">
        {steps.map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`h-5 w-5 rounded-md flex items-center justify-center text-[9px] font-bold ${
                  step.type === "trigger"
                    ? "bg-[#4f8ef7]/30 text-[#4f8ef7] border border-[#4f8ef7]/40"
                    : step.type === "end"
                    ? "bg-green-400/20 text-green-400 border border-green-400/30"
                    : "bg-white/[0.06] text-white/40 border border-white/[0.08]"
                }`}
              >
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="h-2 w-px bg-white/10 my-0.5" />}
            </div>
            <span className="text-[11px] text-white/60">{step.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}


/* ══════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════ */
const testimonials = [
  {
    name: "Sarah K.",
    role: "Content Creator · 280K followers",
    quote:
      "I used to spend 4 hours reformatting every video for each platform. Now it takes under 10 minutes. The watermark removal alone was worth it.",
    initials: "SK",
  },
  {
    name: "Marcus T.",
    role: "Brand Strategist",
    quote:
      "We run campaigns across 6 platforms. Distribution Machine cut our production pipeline in half and the output quality is exactly what we need.",
    initials: "MT",
  },
  {
    name: "Priya L.",
    role: "Agency Owner · 12-person team",
    quote:
      "The workflow automation is genuinely impressive. We scheduled a month of content for a client in one afternoon. That wasn't possible before.",
    initials: "PL",
  },
];

/* ══════════════════════════════════════════════════════════
   FAQ DATA
══════════════════════════════════════════════════════════ */
const faqs = [
  {
    question: "How does the distribution work?",
    answer:
      "You upload one video. Our system automatically reformats it into platform-native aspect ratios and specs (9:16 for TikTok, 1:1 for Instagram, 16:9 for YouTube, etc.), then pushes each version to the connected platforms on your chosen schedule.",
  },
  {
    question: "Does it remove platform watermarks?",
    answer:
      "Yes. Our watermark removal engine detects and cleanly erases watermarks from imported content without degrading the underlying video quality or resolution.",
  },
  {
    question: "Can I schedule content in advance?",
    answer:
      "Absolutely. The built-in scheduler lets you queue posts days or weeks ahead across all connected platforms. You can also set recurring workflows so future uploads publish automatically.",
  },
  {
    question: "Is this for beginners or experienced creators?",
    answer:
      "Both. The default one-click workflow is designed to be approachable for solo creators. The workflow builder and API access are built for teams and agencies who need full control.",
  },
  {
    question: "What platforms are supported?",
    answer:
      "Currently: TikTok, Instagram Reels, YouTube Shorts, Facebook Reels, and X (Twitter). Pinterest, LinkedIn, and Snapchat are on the roadmap for Q3 2026.",
  },
];

/* ══════════════════════════════════════════════════════════
   NAV
══════════════════════════════════════════════════════════ */
function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12">
      <div className="absolute inset-0 bg-[#0b0f14]/80 backdrop-blur-md border-b border-white/[0.05]" />
      <div className="relative flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-[#4f8ef7] flex items-center justify-center">
          <div className="h-3 w-3 rounded-sm bg-white/90" />
        </div>
        <span className="text-sm font-bold tracking-tight text-white">Distribution Machine</span>
      </div>
      <div className="relative hidden md:flex items-center gap-8 text-sm text-white/50">
        <a href="#features" className="hover:text-white/90 transition-colors">Features</a>
        <a href="#showcase" className="hover:text-white/90 transition-colors">How it works</a>
        <a href="#testimonials" className="hover:text-white/90 transition-colors">Testimonials</a>
        <a href="#faq" className="hover:text-white/90 transition-colors">FAQ</a>
      </div>
      <div className="relative">
        <PrimaryButton conic={false} className="px-5 py-2 text-sm">Get Early Access</PrimaryButton>
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Dashboard rises from 55vh below its resting position to 0 (fully settled).
  // Completes at 60% scroll progress through the 200vh stage (~120vh of scroll).
  const dashY       = useTransform(scrollYProgress, [0, 0.6], ["45vh", "0vh"]);
  const dashScale   = useTransform(scrollYProgress, [0, 0.6], [0.97, 1]);
  const dashRotateX = useTransform(scrollYProgress, [0, 0.6], [12, 0]);

  // Sentinel ref — placed outside the sticky container so it scrolls naturally
  // and truly leaves the viewport both when scrolling to top AND past the hero.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sentinelRef, { once: false, amount: 0 });

  // 120ms hysteresis — prevents rapid enter/leave flicker from interrupting the sequence.
  const [stableInView, setStableInView] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setStableInView(inView), 120);
    return () => window.clearTimeout(t);
  }, [inView]);

  // Increment playId on every stableInView false→true transition (any direction).
  const [playId, setPlayId] = useState(0);
  const prevInView = useRef<boolean>(false);
  useEffect(() => {
    if (stableInView && !prevInView.current) {
      setPlayId((v) => v + 1);
    }
    prevInView.current = stableInView;
  }, [stableInView]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0f14]">
      <Nav />

      {/* ── HERO SCROLL STAGE ──
          200vh tall: first 100vh is the sticky viewport, remaining 100vh
          provides scroll distance to drive the dashboard reveal animation.
          No overflow-hidden here — dashboard enters naturally from below. */}
      <section ref={heroRef} className="relative" style={{ height: "130vh", zIndex: 20 }}>

        {/* ── STICKY VIEWPORT — pins everything while stage scrolls ── */}
        <div className="hero-sticky">

          {/* Single centered glow — replaces multi-blob setup */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(65% 58% at 50% 68%, rgba(99,102,241,0.38) 0%, rgba(99,102,241,0.20) 22%, rgba(56,189,248,0.09) 45%, rgba(0,0,0,0) 80%), #070B12",
            }}
          />

          {/* ── TEXT LAYER — z-20, stays fixed above dashboard ── */}
          <div className="hero-text-layer pt-40 text-center">
            <div className="mx-auto max-w-4xl px-6">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl"
              >
                Turn Your{" "}
                <span
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontStyle: "italic",
                    fontWeight: 500,
                  }}
                >
                  Content
                </span>{" "}
                Into a{" "}
                <span className="relative inline-block">
                  {/* Glow bloom behind the text */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 -bottom-1 top-1/2 -z-10 blur-[20px]"
                    style={{ background: "linear-gradient(90deg, #4f8ef7, #8b5cf6)", opacity: 0.22 }}
                  />
                  <span className="bg-gradient-to-r from-[#7aaaff] to-[#a78bfa] bg-clip-text text-transparent">
                    Distribution Machine
                  </span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto mt-5 max-w-xl text-lg text-white/48 leading-relaxed"
              >
                Upload once. We automatically reformat, optimize, and publish your video everywhere it matters.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
              >
                <PrimaryButton conic={false} className="px-10 py-4 text-base animate-pulse-glow">Start for Free</PrimaryButton>
                <a
                  href="#features"
                  className="text-sm font-medium text-white/40 hover:text-white/70 underline underline-offset-4 transition-colors"
                >
                  View features
                </a>
              </motion.div>
            </div>
          </div>

          {/* ── VISUAL LAYER — z-10, rises from below on scroll ── */}
          <div className="hero-visual-layer">
            <motion.div
              style={{
                y: dashY,
                scale: dashScale,
                rotateX: dashRotateX,
                transformPerspective: 1200,
                willChange: "transform",
              }}
              className="mx-auto max-w-6xl px-6"
            >
              {/* Ambient glow */}
              <div className="pointer-events-none absolute inset-x-0 -top-8 -z-10 h-40 rounded-full bg-[#4f8ef7]/10 blur-[80px]" />
              {/* Framed container — no overflow-hidden so dashboard is never CSS-clipped */}
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-2 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                <HeroDashboardVisual playId={playId} />
              </div>
            </motion.div>
          </div>

        </div>

        {/* Sentinel — outside sticky, scrolls naturally with document.
            Enters viewport after ~28vh of scroll; exits when user scrolls
            back to top OR past the hero section into the next section. */}
        <div
          ref={sentinelRef}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 h-px"
          style={{ top: "128vh" }}
        />
      </section>

      {/* ── LOGO STRIP ── */}
      <section className="relative py-16 overflow-hidden border-y border-white/[0.05]">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0b0f14] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0b0f14] to-transparent z-10" />
        <FadeIn className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/25">
            Seamlessly integrates with
          </p>
        </FadeIn>
        <MarqueeRow direction="right" />
        <MarqueeRow direction="left" />
      </section>

      {/* ── UI SHOWCASE ── */}
      <section id="showcase" className="relative px-6 py-28 md:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-[#8b5cf6]/5 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-16 text-center">
            <SectionLabel>The Dashboard</SectionLabel>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Where Your Content Becomes a System
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/45">
              One clean interface. Every tool you need to go from raw footage to published content across every platform.
            </p>
          </FadeIn>

          <FadeIn delay={0.15}>
            <motion.div
              style={{ perspective: 1200 }}
              className="relative"
            >
              <motion.div
                initial={{ rotateX: 8, y: 30, opacity: 0 }}
                whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true, margin: "-100px" }}
                className="relative"
              >
                {/* Glow behind dashboard */}
                <div className="absolute -inset-4 rounded-3xl bg-[#4f8ef7]/5 blur-2xl" />
                <DashboardMockup />
              </motion.div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative px-6 py-16 md:px-12">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-14 text-center">
            <SectionLabel>Features</SectionLabel>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              The System Powering Your Growth
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/45">
              From formatting to publishing — automation handles the heavy lifting.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-stretch max-w-3xl mx-auto">
            <FadeIn delay={0.05} className="flex flex-col">
              <LargeFeatureCard />
            </FadeIn>
            <div className="flex flex-col gap-4">
              <FadeIn delay={0.1} className="flex-1 flex flex-col">
                <DistributionCard />
              </FadeIn>
              <FadeIn delay={0.15} className="flex-1 flex flex-col">
                <WorkflowCard />
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="relative px-6 py-24 md:px-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-[#4f8ef7]/4 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-14 text-center">
            <SectionLabel>Testimonials</SectionLabel>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Creators Are Systemizing Their Content
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/45">
              Less guesswork. More structure. Predictable growth.
            </p>
          </FadeIn>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <FadeIn key={t.name} delay={i * 0.12}>
                <GlassCard className="h-full p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-sm font-bold text-white/60">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-white/35">{t.role}</p>
                    </div>
                  </div>
                  <div className="mb-3 flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="h-3 w-3 text-[#4f8ef7]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-white/55 leading-relaxed">"{t.quote}"</p>
                </GlassCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative px-6 py-24 md:px-12">
        <div className="mx-auto max-w-2xl">
          <FadeIn className="mb-12 text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Everything You Need to Know
            </h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <GlassCard hover={false} className="divide-y divide-white/[0.05] px-6">
              {faqs.map((faq) => (
                <Accordion key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </GlassCard>
          </FadeIn>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative px-6 py-32 md:px-12 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#4f8ef7]/8 blur-[140px]" />
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8b5cf6]/6 blur-[80px]" />
        </div>
        <FadeIn className="relative z-10 mx-auto max-w-2xl">
          <h2 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
            Stop Posting.{" "}
            <span className="bg-gradient-to-r from-[#4f8ef7] to-[#8b5cf6] bg-clip-text text-transparent">
              Start Building a System.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-white/45">
            One upload. Every platform. Zero manual reformatting.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <PrimaryButton conic={false} className="px-10 py-4 text-base animate-pulse-glow">
              See How It Works
            </PrimaryButton>
            <p className="text-sm text-white/30">No credit card required · Join the early access list</p>
          </div>
        </FadeIn>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/[0.05] px-6 py-10 md:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-[#4f8ef7] flex items-center justify-center">
              <div className="h-2.5 w-2.5 rounded-sm bg-white/90" />
            </div>
            <span className="text-sm font-semibold text-white/40">Distribution Machine</span>
          </div>
          <p className="text-xs text-white/20">© 2026 Distribution Machine. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="#" className="hover:text-white/50 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
