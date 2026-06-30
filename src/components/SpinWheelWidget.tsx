"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { sfxSpin, sfxWin } from "@/lib/sound";

/* ── Prize segments ─────────────────────────────────────────── */
const PRIZES = [
  { label: "50 Spins",  color: "#6a1a9a" },
  { label: "$5 Cash",   color: "#9a1a55" },
  { label: "2× Boost", color: "#1a5a6a" },
  { label: "$25 Cash",  color: "#7a4510" },
  { label: "Mystery",   color: "#3a1a7a" },
  { label: "$10 Cash",  color: "#7a1a3a" },
  { label: "100 Spins", color: "#1a4a3a" },
  { label: "Jackpot!",  color: "#5a1a8a" },
];

const SEG   = 360 / PRIZES.length;
const C     = 110; // svg centre
const R     = 88;  // radius
const BULBS = 16;

function pt(deg: number, r: number): [number, number] {
  const a = (deg - 90) * (Math.PI / 180);
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

/* ── Reusable wheel SVG (used in both peek + modal) ─────────── */
function WheelSVG({
  rotation,
  onAnimationComplete,
  onHubClick,
  spinning,
  idSuffix,
  reduce,
}: {
  rotation: number;
  onAnimationComplete?: () => void;
  onHubClick?: () => void;
  spinning: boolean;
  idSuffix: string;
  reduce: boolean | null;
}) {
  const goldId   = `gold-${idSuffix}`;
  const hubId    = `hub-${idSuffix}`;
  const domeId   = `dome-${idSuffix}`;
  const shadowId = `shadow-${idSuffix}`;

  return (
    <div className="relative h-full w-full">
      {/* rotating face */}
      <motion.svg
        viewBox="0 0 220 220"
        className="absolute inset-0 h-full w-full"
        animate={{ rotate: rotation }}
        transition={reduce ? { duration: 0 } : { duration: 4.6, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={onAnimationComplete}
      >
        <defs>
          <radialGradient id={domeId} cx="50%" cy="42%" r="62%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.13" />
            <stop offset="55%"  stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.44" />
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
                stroke="rgba(255,198,61,0.35)"
                strokeWidth="1"
              />
              <text
                x={tx} y={ty}
                fill="#fff"
                fontSize="7.2"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${i * SEG + SEG / 2},${tx},${ty})`}
                style={{ textShadow: "0 1px 3px rgba(0,0,0,0.7)" }}
              >
                {p.label}
              </text>
            </g>
          );
        })}
        <circle cx={C} cy={C} r={R} fill={`url(#${domeId})`} />
      </motion.svg>

      {/* static: rim + bulbs + hub + pointer */}
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#fff2c0" />
            <stop offset="42%"  stopColor="#f6c84d" />
            <stop offset="60%"  stopColor="#dca42c" />
            <stop offset="100%" stopColor="#9c6e16" />
          </linearGradient>
          <radialGradient id={hubId} cx="50%" cy="38%" r="65%">
            <stop offset="0%"   stopColor="#ff2e9a" />
            <stop offset="50%"  stopColor="#b056ff" />
            <stop offset="100%" stopColor="#3a0860" />
          </radialGradient>
          <filter id={shadowId} x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* gold rim */}
        <circle cx={C} cy={C} r={97}  fill="none" stroke={`url(#${goldId})`} strokeWidth="11" filter={`url(#${shadowId})`} />
        <circle cx={C} cy={C} r={91}  fill="none" stroke="rgba(0,0,0,0.55)"       strokeWidth="2" />
        <circle cx={C} cy={C} r={103} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* neon bulbs — 4-colour cycle */}
        {Array.from({ length: BULBS }).map((_, i) => {
          const [bx, by] = pt((360 / BULBS) * i, 97);
          const cols = ["#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d"];
          const col  = cols[i % cols.length];
          return (
            <circle key={i} cx={bx} cy={by} r={3.2}
              fill={col} stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"
              style={{
                filter: `drop-shadow(0 0 5px ${col})`,
                animation: `twinkle 1.8s ease-in-out ${(i % 4) * 0.25}s infinite`,
              }}
            />
          );
        })}

        {/* clickable neon hub */}
        <circle cx={C} cy={C} r={23}
          fill={`url(#${hubId})`}
          stroke="rgba(255,46,154,0.7)"
          strokeWidth="2"
          onClick={onHubClick}
          style={{
            cursor: spinning ? "default" : "pointer",
            filter: "drop-shadow(0 0 10px rgba(255,46,154,0.8))",
          }}
        />
        <text
          x={C} y={C}
          textAnchor="middle" dominantBaseline="middle"
          fill="#fff" fontSize="9" fontWeight="800" letterSpacing="1.2"
          style={{ fontFamily: "var(--font-sora,sans-serif)", pointerEvents: "none" }}
        >
          SPIN
        </text>

        {/* magenta triangle pointer */}
        <g filter={`url(#${shadowId})`}>
          <path d="M110,17 L101,37 L119,37 Z" fill="#ff2e9a" stroke="#fff" strokeWidth="1" />
          <circle cx={110} cy={12} r={5.5} fill="#ff2e9a" stroke="#fff" strokeWidth="1"
            style={{ filter: "drop-shadow(0 0 7px #ff2e9a)" }} />
        </g>
      </svg>
    </div>
  );
}

/* ── Main widget ─────────────────────────────────────────────── */
export default function SpinWheelWidget() {
  const reduce  = useReducedMotion();
  const [open,     setOpen]     = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result,   setResult]   = useState<string | null>(null);

  function spin() {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    sfxSpin();
    const winner = Math.floor(Math.random() * PRIZES.length);
    const target = 360 * 5 + (360 - winner * SEG - SEG / 2);
    setRotation(prev => prev - (prev % 360) + target);
    if (reduce) {
      setSpinning(false);
      setResult(PRIZES[winner].label);
      sfxWin();
    }
  }

  function handleComplete() {
    if (!spinning) return;
    setSpinning(false);
    const idx = (PRIZES.length - Math.round(((rotation % 360) + SEG / 2) / SEG)) % PRIZES.length;
    setResult(PRIZES[(idx + PRIZES.length) % PRIZES.length].label);
    sfxWin();
  }

  function openModal() {
    setResult(null);
    setOpen(true);
  }

  return (
    <>
      {/* ── PEEKING WHEEL (always visible, right edge) ──────── */}
      <AnimatePresence>
        {!open && (
          <motion.div
            key="peek"
            initial={{ x: 120 }}
            animate={{ x: 0 }}
            exit={{ x: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.6 }}
            onClick={openModal}
            aria-label="Open spin wheel"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && openModal()}
            className="fixed right-0 z-40 cursor-pointer"
            style={{
              top: "50%",
              transform: "translateY(-50%) translateX(50%)",
              /* show only the left half */
            }}
          >
            {/* glow halo */}
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,46,154,0.5) 0%, rgba(176,86,255,0.35) 40%, transparent 70%)",
                filter: "blur(18px)",
                animation: "peek-pulse 3s ease-in-out infinite",
              }}
            />

            {/* wheel */}
            <div className="relative h-[180px] w-[180px]">
              <WheelSVG
                rotation={0}
                spinning={false}
                onHubClick={openModal}
                idSuffix="peek"
                reduce={reduce}
              />
            </div>

            {/* "TAP TO SPIN" label on visible edge */}
            <div
              className="absolute left-2 top-1/2 -translate-y-1/2 -translate-x-1 flex flex-col items-center gap-1"
              style={{ pointerEvents: "none" }}
            >
              <svg width="16" height="28" viewBox="0 0 16 28" fill="none">
                <path d="M14 14H2M2 14L8 8M2 14L8 20" stroke="#ffc63d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                className="block rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-white"
                style={{
                  background: "linear-gradient(135deg,#ff2e9a,#b056ff)",
                  boxShadow: "0 0 10px rgba(255,46,154,0.7)",
                  writingMode: "vertical-rl",
                  letterSpacing: "0.2em",
                }}
              >
                Spin
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
              onClick={() => !spinning && setOpen(false)}
            />

            {/* panel — slides in from right */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, x: 80, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.92 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-[360px] -translate-y-1/2 rounded-3xl p-6"
              style={{
                background: "linear-gradient(145deg, #110826 0%, #0d0620 60%, #180830 100%)",
                border: "1px solid rgba(255,46,154,0.25)",
                boxShadow: "0 0 0 1px rgba(176,86,255,0.15), 0 40px 100px -20px rgba(255,46,154,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
              }}
            >
              {/* header */}
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#ff2e9a" }}>Daily Reward</p>
                  <h2 className="font-display text-xl font-extrabold text-white">Spin a Wheel</h2>
                </div>
                <button
                  onClick={() => !spinning && setOpen(false)}
                  aria-label="Close spin wheel"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-colors"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>

              {/* wheel */}
              <div className="relative mx-auto h-[260px] w-[260px]">
                {/* glow */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle, rgba(255,46,154,0.4), rgba(176,86,255,0.3) 45%, transparent 70%)",
                    filter: "blur(20px)",
                    opacity: spinning ? 0.9 : 0.5,
                  }}
                />
                <WheelSVG
                  rotation={rotation}
                  onAnimationComplete={handleComplete}
                  onHubClick={spin}
                  spinning={spinning}
                  idSuffix="modal"
                  reduce={reduce}
                />
              </div>

              {/* result / CTA */}
              <div className="mt-6 text-center">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <p className="font-display text-2xl font-extrabold" style={{ color: "#ffc63d", textShadow: "0 0 20px #ffc63daa" }}>
                        You won {result}!
                      </p>
                      <p className="mt-1 text-sm text-white/50">Prize added to your account</p>
                      <button
                        onClick={() => setResult(null)}
                        className="mt-4 text-xs text-white/30 underline-offset-2 hover:text-white/60 hover:underline cursor-pointer transition-colors"
                      >
                        Come back tomorrow for another spin
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <button
                        onClick={spin}
                        disabled={spinning}
                        className="w-full cursor-pointer rounded-2xl py-3.5 font-display text-base font-extrabold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          background: "linear-gradient(135deg,#ff2e9a,#b056ff)",
                          boxShadow: "0 8px 28px -8px rgba(255,46,154,0.7)",
                        }}
                      >
                        {spinning ? "Spinning…" : "Spin the Wheel"}
                      </button>
                      <p className="mt-3 text-xs text-white/35">
                        One free spin per day · No purchase necessary
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes peek-pulse {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
      `}</style>
    </>
  );
}
