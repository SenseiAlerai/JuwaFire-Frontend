"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CandyButton } from "./CandyButton";
import { sfxSpin, sfxWin } from "@/lib/sound";

// Deeper jewel tones — vivid but easy on the eyes, lifted with a domed sheen + gold.
const PRIZES = [
  { label: "50 Spins", color: "#b1245f" },
  { label: "$5", color: "#6a32b3" },
  { label: "x2 Boost", color: "#1c8194" },
  { label: "$25", color: "#5d8f24" },
  { label: "Mystery", color: "#c8901f" },
  { label: "$10", color: "#c0601f" },
  { label: "100 Spins", color: "#b12c49" },
  { label: "Jackpot", color: "#46318c" },
];

const SEG = 360 / PRIZES.length;
const C = 110; // svg centre
const R = 88; // segment radius
const BULBS = 16;

function pt(angleDeg: number, radius: number) {
  const a = (angleDeg - 90) * (Math.PI / 180);
  return [C + radius * Math.cos(a), C + radius * Math.sin(a)] as const;
}

export default function FortuneWheel() {
  const reduce = useReducedMotion();
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
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-72 w-72 sm:h-[21rem] sm:w-[21rem]">
        {/* glow halo behind the wheel — intensifies while spinning */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 ${
            spinning ? "opacity-90" : "opacity-50"
          }`}
          style={{ background: "radial-gradient(circle, rgba(255,46,154,0.35), rgba(176,86,255,0.25) 45%, transparent 70%)" }}
        />

        {/* ── rotating wheel face ── */}
        <motion.svg
          viewBox="0 0 220 220"
          className="absolute inset-0 h-full w-full"
          animate={{ rotate: rotation }}
          transition={reduce ? { duration: 0 } : { duration: 4.6, ease: [0.16, 1, 0.3, 1] }}
          onAnimationComplete={() => {
            if (spinning) {
              setSpinning(false);
              const idx =
                (PRIZES.length - Math.round(((rotation % 360) + SEG / 2) / SEG)) % PRIZES.length;
              setResult(PRIZES[(idx + PRIZES.length) % PRIZES.length].label);
              sfxWin();
            }
          }}
        >
          <defs>
            {/* domed depth: subtle dark vignette toward the rim */}
            <radialGradient id="dome" cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.4" />
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
                  stroke="rgba(255,210,120,0.55)"
                  strokeWidth="1"
                />
                <text
                  x={tx}
                  y={ty}
                  fill="#fff"
                  fontSize="8.5"
                  fontWeight="700"
                  fontFamily="var(--font-display)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${i * SEG + SEG / 2}, ${tx}, ${ty})`}
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.45)" }}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          {/* domed sheen over the whole face */}
          <circle cx={C} cy={C} r={R} fill="url(#dome)" />
        </motion.svg>

        {/* ── static gold frame, bulbs, hub & pointer (don't rotate) ── */}
        <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff2c0" />
              <stop offset="42%" stopColor="#f6c84d" />
              <stop offset="60%" stopColor="#dca42c" />
              <stop offset="100%" stopColor="#9c6e16" />
            </linearGradient>
            <radialGradient id="hub" cx="50%" cy="38%" r="65%">
              <stop offset="0%" stopColor="#fff4cb" />
              <stop offset="55%" stopColor="#f0c044" />
              <stop offset="100%" stopColor="#9c6e16" />
            </radialGradient>
            <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* metallic rim */}
          <circle cx={C} cy={C} r={97} fill="none" stroke="url(#gold)" strokeWidth="11" filter="url(#soft)" />
          <circle cx={C} cy={C} r={91} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="2" />
          <circle cx={C} cy={C} r={103} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />

          {/* rim bulbs */}
          {Array.from({ length: BULBS }).map((_, i) => {
            const [bx, by] = pt((360 / BULBS) * i, 97);
            return (
              <circle
                key={i}
                cx={bx}
                cy={by}
                r={2.6}
                fill="#fff6d6"
                stroke="#b8860b"
                strokeWidth="0.6"
                style={{
                  filter: "drop-shadow(0 0 3px #ffe487)",
                  animation: `twinkle 1.8s ease-in-out ${(i % 4) * 0.25}s infinite`,
                }}
              />
            );
          })}

          {/* centre hub */}
          <circle cx={C} cy={C} r={20} fill="url(#hub)" stroke="#fff2c0" strokeWidth="1.5" filter="url(#soft)" />
          {/* crown mark */}
          <path
            d="M99,116 L96,104 L103,109 L110,99 L117,109 L124,104 L121,116 Z"
            fill="#3a2208"
          />
          <circle cx={110} cy={116.5} r={1.4} fill="#3a2208" />

          {/* gem pointer at the top, pointing down into the wheel */}
          <g filter="url(#soft)">
            <path d="M110,40 L99,12 Q110,4 121,12 Z" fill="url(#gold)" stroke="#fff2c0" strokeWidth="1" />
            <circle cx={110} cy={13} r={5.5} fill="url(#hub)" stroke="#fff2c0" strokeWidth="1" />
          </g>
        </svg>
      </div>

      {/* result + control */}
      <div className="mt-6 flex h-9 items-center">
        {result ? (
          <span className="neon-chip rounded-full px-4 py-1.5 font-display font-bold text-gold">
            You won {result}!
          </span>
        ) : (
          <span className="font-display text-sm text-ink-soft">Daily spin — one free pull a day</span>
        )}
      </div>
      <CandyButton variant="gold" size="lg" onClick={spin} disabled={spinning} className="mt-2">
        {spinning ? "Spinning…" : "Spin to Win"}
      </CandyButton>
    </div>
  );
}
