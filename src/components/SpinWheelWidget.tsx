"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { sfxSpin, sfxWin } from "@/lib/sound";

const PRIZES = [
  { label: "50 Spins",   color: "#b056ff" },
  { label: "$5 Cash",    color: "#ff2e9a" },
  { label: "2× Boost",  color: "#1a6b7a" },
  { label: "$25 Cash",   color: "#7a4a10" },
  { label: "Mystery",    color: "#4a1a7a" },
  { label: "$10 Cash",   color: "#8a1a3a" },
  { label: "100 Spins",  color: "#1a4a3a" },
  { label: "Jackpot!",   color: "#6a2a9a" },
];

const SEG = 360 / PRIZES.length;
const C = 110;
const R = 88;
const BULBS = 16;

function pt(angleDeg: number, radius: number) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)] as [number, number];
}

function WheelFace({ rotation, reduce }: { rotation: number; reduce: boolean | null }) {
  return (
    <>
      {/* rotating segments */}
      <motion.svg
        viewBox="0 0 220 220"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: rotation }}
        transition={reduce ? { duration: 0 } : { duration: 4.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <defs>
          <radialGradient id="sw-dome" cx="50%" cy="42%" r="62%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.14" />
            <stop offset="55%"  stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
          </radialGradient>
        </defs>
        {PRIZES.map((p, i) => {
          const [x0, y0] = pt(i * SEG, R);
          const [x1, y1] = pt((i + 1) * SEG, R);
          const [tx, ty] = pt(i * SEG + SEG / 2, R * 0.66);
          return (
            <g key={i}>
              <path
                d={`M${C},${C} L${x0},${y0} A${R},${R} 0 0,1 ${x1},${y1} Z`}
                fill={p.color}
                stroke="rgba(255,210,120,0.4)"
                strokeWidth="1"
              />
              <text
                x={tx} y={ty}
                fill="#fff"
                fontSize="7.5"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${i * SEG + SEG / 2}, ${tx}, ${ty})`}
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
              >
                {p.label}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R} fill="url(#sw-dome)" />
      </motion.svg>

      {/* static: rim + bulbs + hub + pointer */}
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="sw-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#fff2c0" />
            <stop offset="42%"  stopColor="#f6c84d" />
            <stop offset="60%"  stopColor="#dca42c" />
            <stop offset="100%" stopColor="#9c6e16" />
          </linearGradient>
          <radialGradient id="sw-hub" cx="50%" cy="38%" r="65%">
            <stop offset="0%"   stopColor="#ff2e9a" />
            <stop offset="50%"  stopColor="#b056ff" />
            <stop offset="100%" stopColor="#4a0a6a" />
          </radialGradient>
          <filter id="sw-shadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.5" />
          </filter>
          <filter id="sw-neon">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#ff2e9a" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* metallic rim */}
        <circle cx={C} cy={C} r={97}  fill="none" stroke="url(#sw-gold)" strokeWidth="11" filter="url(#sw-shadow)" />
        <circle cx={C} cy={C} r={91}  fill="none" stroke="rgba(0,0,0,0.5)"   strokeWidth="2" />
        <circle cx={C} cy={C} r={103} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

        {/* rim bulbs */}
        {Array.from({ length: BULBS }).map((_, i) => {
          const [bx, by] = pt((360 / BULBS) * i, 97);
          const colors = ["#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d"];
          const c = colors[i % colors.length];
          return (
            <circle
              key={i}
              cx={bx} cy={by} r={3}
              fill={c}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="0.5"
              style={{
                filter: `drop-shadow(0 0 4px ${c})`,
                animation: `twinkle 1.8s ease-in-out ${(i % 4) * 0.25}s infinite`,
              }}
            />
          );
        })}

        {/* neon hub */}
        <circle cx={C} cy={C} r={22} fill="url(#sw-hub)" stroke="rgba(255,46,154,0.6)" strokeWidth="2" filter="url(#sw-neon)" />
        <text
          x={C} y={C}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="9"
          fontWeight="800"
          letterSpacing="1"
          style={{ fontFamily: "var(--font-sora, sans-serif)" }}
        >
          SPIN
        </text>

        {/* red triangle pointer at top */}
        <g filter="url(#sw-shadow)">
          <path d="M110,17 L101,36 L119,36 Z" fill="#ff2e9a" stroke="#fff" strokeWidth="1" />
          <circle cx={110} cy={13} r={5} fill="#ff2e9a" stroke="#fff" strokeWidth="1"
            style={{ filter: "drop-shadow(0 0 6px #ff2e9a)" }} />
        </g>
      </svg>
    </>
  );
}

/* ─── Floating button icon ─────────────────────────────────── */
function WheelIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-7 w-7">
      <circle cx="20" cy="20" r="17" fill="#1a0a2a" stroke="url(#wi-gold)" strokeWidth="3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const colors = ["#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d", "#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d"];
        const a = (angle - 90) * (Math.PI / 180);
        const x1 = 20 + 5 * Math.cos(a), y1 = 20 + 5 * Math.sin(a);
        const x2 = 20 + 15 * Math.cos(a), y2 = 20 + 15 * Math.sin(a);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={colors[i]} strokeWidth="3" strokeLinecap="round" />;
      })}
      <circle cx="20" cy="20" r="4" fill="#ff2e9a" style={{ filter: "drop-shadow(0 0 4px #ff2e9a)" }} />
      <defs>
        <linearGradient id="wi-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f6c84d" />
          <stop offset="100%" stopColor="#9c6e16" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Main widget ──────────────────────────────────────────── */
export default function SpinWheelWidget() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function spin() {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    sfxSpin();
    const winner = Math.floor(Math.random() * PRIZES.length);
    const target = 360 * 5 + (360 - winner * SEG - SEG / 2);
    const next = rotation - (rotation % 360) + target;
    setRotation(next);
    if (reduce) {
      setSpinning(false);
      setResult(PRIZES[winner].label);
      sfxWin();
    }
  }

  function handleAnimationComplete() {
    if (!spinning) return;
    setSpinning(false);
    const idx = (PRIZES.length - Math.round(((rotation % 360) + SEG / 2) / SEG)) % PRIZES.length;
    setResult(PRIZES[(idx + PRIZES.length) % PRIZES.length].label);
    sfxWin();
  }

  return (
    <>
      {/* ── Floating button ── */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open spin wheel"
        className="fixed bottom-44 right-3 z-40 grid h-14 w-14 cursor-pointer place-items-center rounded-full border border-white/10 bg-[#0d0620] shadow-[0_0_20px_rgba(255,46,154,0.5)] transition-transform hover:scale-110 active:scale-90 md:bottom-24"
        style={{ animation: "pulse-neon 3s ease-in-out infinite" }}
      >
        <WheelIcon />
      </button>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={() => !spinning && setOpen(false)}
            />

            {/* modal panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.88, y: 32 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 32 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-sm -translate-y-1/2 rounded-3xl border border-white/10 bg-[#0d0620] p-6 shadow-[0_40px_100px_-20px_rgba(255,46,154,0.4)]"
            >
              {/* header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">Spin a Wheel</h2>
                <button
                  onClick={() => !spinning && setOpen(false)}
                  aria-label="Close"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* wheel */}
              <div className="relative mx-auto h-64 w-64">
                <div
                  className={`pointer-events-none absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${spinning ? "opacity-80" : "opacity-40"}`}
                  style={{ background: "radial-gradient(circle, rgba(255,46,154,0.4), rgba(176,86,255,0.3) 45%, transparent 70%)" }}
                />
                <motion.svg
                  viewBox="0 0 220 220"
                  className="absolute inset-0 h-full w-full"
                  animate={{ rotate: rotation }}
                  transition={reduce ? { duration: 0 } : { duration: 4.6, ease: [0.16, 1, 0.3, 1] }}
                  onAnimationComplete={handleAnimationComplete}
                >
                  <defs>
                    <radialGradient id="sw-dome2" cx="50%" cy="42%" r="62%">
                      <stop offset="0%"   stopColor="#fff" stopOpacity="0.14" />
                      <stop offset="55%"  stopColor="#000" stopOpacity="0" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0.42" />
                    </radialGradient>
                  </defs>
                  {PRIZES.map((p, i) => {
                    const [x0, y0] = pt(i * SEG, R);
                    const [x1, y1] = pt((i + 1) * SEG, R);
                    const [tx, ty] = pt(i * SEG + SEG / 2, R * 0.66);
                    return (
                      <g key={i}>
                        <path
                          d={`M${C},${C} L${x0},${y0} A${R},${R} 0 0,1 ${x1},${y1} Z`}
                          fill={p.color}
                          stroke="rgba(255,210,120,0.4)"
                          strokeWidth="1"
                        />
                        <text
                          x={tx} y={ty}
                          fill="#fff"
                          fontSize="7.5"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${i * SEG + SEG / 2}, ${tx}, ${ty})`}
                          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                        >
                          {p.label}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx={C} cy={C} r={R} fill="url(#sw-dome2)" />
                </motion.svg>

                {/* static overlay */}
                <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
                  <defs>
                    <linearGradient id="sw-gold2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#fff2c0" />
                      <stop offset="42%"  stopColor="#f6c84d" />
                      <stop offset="60%"  stopColor="#dca42c" />
                      <stop offset="100%" stopColor="#9c6e16" />
                    </linearGradient>
                    <radialGradient id="sw-hub2" cx="50%" cy="38%" r="65%">
                      <stop offset="0%"   stopColor="#ff2e9a" />
                      <stop offset="50%"  stopColor="#b056ff" />
                      <stop offset="100%" stopColor="#4a0a6a" />
                    </radialGradient>
                    <filter id="sw-shadow2" x="-40%" y="-40%" width="180%" height="180%">
                      <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.5" />
                    </filter>
                  </defs>
                  <circle cx={C} cy={C} r={97}  fill="none" stroke="url(#sw-gold2)" strokeWidth="11" filter="url(#sw-shadow2)" />
                  <circle cx={C} cy={C} r={91}  fill="none" stroke="rgba(0,0,0,0.5)"        strokeWidth="2" />
                  <circle cx={C} cy={C} r={103} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
                  {Array.from({ length: BULBS }).map((_, i) => {
                    const [bx, by] = pt((360 / BULBS) * i, 97);
                    const colors = ["#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d"];
                    const c = colors[i % colors.length];
                    return (
                      <circle key={i} cx={bx} cy={by} r={3} fill={c} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"
                        style={{ filter: `drop-shadow(0 0 4px ${c})`, animation: `twinkle 1.8s ease-in-out ${(i % 4) * 0.25}s infinite` }}
                      />
                    );
                  })}
                  {/* clickable hub */}
                  <circle
                    cx={C} cy={C} r={22}
                    fill="url(#sw-hub2)"
                    stroke="rgba(255,46,154,0.6)"
                    strokeWidth="2"
                    style={{ cursor: spinning ? "default" : "pointer", filter: "drop-shadow(0 0 8px rgba(255,46,154,0.7))" }}
                    onClick={spin}
                  />
                  <text
                    x={C} y={C}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="9"
                    fontWeight="800"
                    letterSpacing="1"
                    style={{ fontFamily: "var(--font-sora, sans-serif)", pointerEvents: "none" }}
                  >
                    SPIN
                  </text>
                  {/* pointer */}
                  <g filter="url(#sw-shadow2)">
                    <path d="M110,17 L101,36 L119,36 Z" fill="#ff2e9a" stroke="#fff" strokeWidth="1" />
                    <circle cx={110} cy={13} r={5} fill="#ff2e9a" stroke="#fff" strokeWidth="1"
                      style={{ filter: "drop-shadow(0 0 6px #ff2e9a)" }} />
                  </g>
                </svg>
              </div>

              {/* result / nudge */}
              <div className="mt-5 text-center">
                {result ? (
                  <p className="font-display text-lg font-bold" style={{ color: "#ffc63d", textShadow: "0 0 12px #ffc63d88" }}>
                    🎉 You won {result}!
                  </p>
                ) : (
                  <>
                    <button
                      onClick={spin}
                      disabled={spinning}
                      className="w-full rounded-2xl py-3 font-display font-bold text-white transition-opacity disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #ff2e9a, #b056ff)", boxShadow: "0 8px 24px -8px rgba(255,46,154,0.6)" }}
                    >
                      {spinning ? "Spinning…" : "Spin the Wheel"}
                    </button>
                    <p className="mt-3 text-xs text-white/40">Daily spin — one free pull per day</p>
                  </>
                )}
                {result && (
                  <button
                    onClick={() => { setResult(null); }}
                    className="mt-3 text-xs text-white/40 underline-offset-2 hover:underline"
                  >
                    Spin again tomorrow
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-neon {
          0%, 100% { box-shadow: 0 0 20px rgba(255,46,154,0.5); }
          50%       { box-shadow: 0 0 32px rgba(176,86,255,0.8), 0 0 48px rgba(255,46,154,0.4); }
        }
      `}</style>
    </>
  );
}
