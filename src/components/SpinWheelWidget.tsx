"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { sfxSpin, sfxWin, sfxTick, sfxCoin } from "@/lib/sound";

/** Mobile haptic feedback — no-op where unsupported. */
function haptic(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }
}

/* ─── Prize data ───────────────────────────────────────────────── */
const PRIZES = [
  { label: "50",   sub: "SPINS",   coin: "#ffc63d" },
  { label: "$5",   sub: "CASH",    coin: "#aaff3c" },
  { label: "2×",   sub: "BOOST",   coin: "#2de2ff" },
  { label: "$25",  sub: "CASH",    coin: "#ffc63d" },
  { label: "???",  sub: "MYSTERY", coin: "#b056ff" },
  { label: "$10",  sub: "CASH",    coin: "#ffc63d" },
  { label: "100",  sub: "SPINS",   coin: "#aaff3c" },
  { label: "🔥",   sub: "JACKPOT", coin: "#ff3b5c" },
];

/* Daily-spin cooldown (client-side, per device). */
const SPIN_KEY = "juwa:lastSpinAt";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

/* alternating high-contrast: deep casino red ↔ near-black purple */
const SEG_COLORS = ["#7a0c1f", "#0c0420"];

const N   = PRIZES.length;
const SEG = 360 / N;
const C   = 120; // SVG centre (240×240 viewBox)
const R   = 96;  // segment radius
const RIM = 106; // outer rim radius
const BULBS = 16;

function pt(deg: number, r: number): [number, number] {
  const a = (deg - 90) * (Math.PI / 180);
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
}

/* ─── SVG Coin icon ────────────────────────────────────────────── */
function CoinAt({ cx, cy, color, r = 7 }: { cx: number; cy: number; color: string; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 1.5} fill="rgba(0,0,0,0.4)" />
      <circle cx={cx} cy={cy} r={r} fill={color} stroke="#fff8d0" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
    </g>
  );
}

/* ─── Shared wheel graphic ─────────────────────────────────────── */
function WheelSVG({
  rotation, onAnimationComplete, onHubClick, spinning, idSuffix, reduce, idle = false,
}: {
  rotation: number;
  onAnimationComplete?: () => void;
  onHubClick?: () => void;
  spinning: boolean;
  idSuffix: string;
  reduce: boolean | null;
  idle?: boolean;
}) {
  const ids = {
    gold:    `gold-${idSuffix}`,
    hub:     `hub-${idSuffix}`,
    dome:    `dome-${idSuffix}`,
    shadow:  `shadow-${idSuffix}`,
    outerGlow: `og-${idSuffix}`,
    seg:     (i: number) => `seg-${idSuffix}-${i}`,
  };

  return (
    <div className="relative h-full w-full">
      {/* ── rotating face ── */}
      <motion.svg
        viewBox="0 0 240 240"
        className="absolute inset-0 h-full w-full"
        animate={idle && !reduce ? { rotate: 360 } : { rotate: rotation }}
        transition={
          idle && !reduce
            ? { repeat: Infinity, ease: "linear", duration: 18 }
            : reduce
              ? { duration: 0 }
              : { duration: 4.8, ease: [0.16, 1, 0.3, 1] }
        }
        onAnimationComplete={onAnimationComplete}
      >
        <defs>
          <radialGradient id={ids.dome} cx="50%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#fff" stopOpacity="0.18" />
            <stop offset="50%"  stopColor="#fff" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
          </radialGradient>
          {PRIZES.map((_, i) => (
            <radialGradient key={i} id={ids.seg(i)} cx="30%" cy="30%" r="80%">
              <stop offset="0%" stopColor={i % 2 === 0 ? "#c01030" : "#1a0835"} stopOpacity="1" />
              <stop offset="100%" stopColor={SEG_COLORS[i % 2]} stopOpacity="1" />
            </radialGradient>
          ))}
        </defs>

        {/* segments */}
        {PRIZES.map((p, i) => {
          const [x0, y0] = pt(i * SEG, R);
          const [x1, y1] = pt((i + 1) * SEG, R);
          const midAngle = i * SEG + SEG / 2;
          const [tx, ty] = pt(midAngle, R * 0.58);
          const [sx, sy] = pt(midAngle, R * 0.73);
          const [cx, cy] = pt(midAngle, R * 0.88);

          return (
            <g key={i}>
              {/* wedge */}
              <path
                d={`M${C},${C} L${x0},${y0} A${R},${R} 0 0,1 ${x1},${y1} Z`}
                fill={`url(#${ids.seg(i)})`}
              />
              {/* gold divider line */}
              <line
                x1={C} y1={C}
                x2={x0} y2={y0}
                stroke="rgba(255,198,61,0.55)"
                strokeWidth="1"
              />
              {/* prize amount */}
              <text
                x={tx} y={ty}
                fill="#ffffff"
                fontSize={p.label.length > 2 ? "11" : "13"}
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                style={{ textShadow: "0 0 8px rgba(0,0,0,0.9)", fontFamily: "var(--font-sora,sans-serif)" }}
              >
                {p.label}
              </text>
              {/* sub-label */}
              <text
                x={sx} y={sy}
                fill="rgba(255,255,255,0.75)"
                fontSize="6"
                fontWeight="700"
                letterSpacing="0.5"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${midAngle}, ${sx}, ${sy})`}
              >
                {p.sub}
              </text>
              {/* outer coin icon */}
              <g transform={`rotate(${midAngle}, ${C}, ${C})`}>
                <CoinAt cx={cx} cy={cy} color={p.coin} r={6.5} />
              </g>
            </g>
          );
        })}

        {/* dome sheen */}
        <circle cx={C} cy={C} r={R} fill={`url(#${ids.dome})`} />
      </motion.svg>

      {/* ── static layer: rim + bulbs + hub + pointer ── */}
      <svg viewBox="0 0 240 240" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={ids.gold} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#fff6b0" />
            <stop offset="30%"  stopColor="#f7d060" />
            <stop offset="65%"  stopColor="#d4920a" />
            <stop offset="100%" stopColor="#8a5e00" />
          </linearGradient>
          <radialGradient id={ids.hub} cx="45%" cy="35%" r="70%">
            <stop offset="0%"   stopColor="#ff5ab8" />
            <stop offset="45%"  stopColor="#c026e0" />
            <stop offset="100%" stopColor="#38006a" />
          </radialGradient>
          <filter id={ids.shadow} x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
          </filter>
          <filter id={ids.outerGlow} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffc63d" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* outer decorative ring — thin gold */}
        <circle cx={C} cy={C} r={RIM + 5}
          fill="none" stroke="rgba(255,210,80,0.35)" strokeWidth="1.5" />

        {/* main gold rim */}
        <circle cx={C} cy={C} r={RIM}
          fill="none"
          stroke={`url(#${ids.gold})`}
          strokeWidth="14"
          filter={`url(#${ids.shadow})`} />

        {/* rim inner shadow */}
        <circle cx={C} cy={C} r={RIM - 7}
          fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth="2" />

        {/* rim outer highlight */}
        <circle cx={C} cy={C} r={RIM + 7}
          fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />

        {/* ── bulbs: 4-colour neon cycle, larger ── */}
        {Array.from({ length: BULBS }).map((_, i) => {
          const [bx, by] = pt((360 / BULBS) * i, RIM);
          const cols = ["#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d"];
          const col  = cols[i % cols.length];
          return (
            <g key={i}>
              {/* shadow base */}
              <circle cx={bx} cy={by} r={6.5}
                fill="rgba(0,0,0,0.5)" />
              {/* coloured bulb — light chases around the rim */}
              <circle cx={bx} cy={by} r={5.5}
                fill={col}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.8"
                style={{
                  filter: `drop-shadow(0 0 6px ${col}) drop-shadow(0 0 12px ${col}88)`,
                  animation: `bulb-chase 1.8s linear ${(i / BULBS) * 1.8}s infinite`,
                }}
              />
              {/* specular highlight */}
              <circle cx={bx - 1.5} cy={by - 1.5} r={1.8}
                fill="rgba(255,255,255,0.6)" />
            </g>
          );
        })}

        {/* ── hub ── */}
        <circle cx={C} cy={C} r={28}
          fill="rgba(0,0,0,0.6)"
          filter={`url(#${ids.shadow})`} />
        <circle cx={C} cy={C} r={25}
          fill={`url(#${ids.hub})`}
          stroke="rgba(255,90,184,0.8)"
          strokeWidth="2"
          onClick={onHubClick}
          style={{
            cursor: spinning ? "default" : "pointer",
            filter: "drop-shadow(0 0 12px rgba(255,46,154,0.9)) drop-shadow(0 0 24px rgba(176,86,255,0.5))",
          }}
        />
        {/* hub ring */}
        <circle cx={C} cy={C} r={19}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          style={{ pointerEvents: "none" }} />
        <text
          x={C} y={C - 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize="10"
          fontWeight="900"
          letterSpacing="1.5"
          style={{
            fontFamily: "var(--font-sora,sans-serif)",
            pointerEvents: "none",
            textShadow: "0 0 8px rgba(255,255,255,0.8)",
          }}
        >
          SPIN
        </text>

        {/* ── pointer (flaps against the pegs while spinning) ── */}
        <g
          filter={`url(#${ids.shadow})`}
          style={{
            transformBox: "view-box",
            transformOrigin: "120px 22px",
            animation: spinning ? "pointer-tick 0.09s steps(2,end) infinite" : undefined,
          }}
        >
          {/* pointer body */}
          <path d="M120,20 L109,44 L131,44 Z"
            fill="#ff2e9a"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinejoin="round" />
          {/* pointer gem */}
          <circle cx={120} cy={14} r={7}
            fill="#ff2e9a"
            stroke="#fff"
            strokeWidth="1.5"
            style={{ filter: "drop-shadow(0 0 8px #ff2e9a) drop-shadow(0 0 16px #ff2e9aaa)" }} />
          {/* gem specular */}
          <circle cx={118} cy={12} r={2.5}
            fill="rgba(255,255,255,0.7)" />
        </g>
      </svg>
    </div>
  );
}

/* ─── Win celebration: gold coin-burst ─────────────────────────── */
function CoinChip() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="#b8860b" />
      <circle cx="10" cy="10" r="8" fill="#ffc63d" stroke="#fff2c0" strokeWidth="0.8" />
      <circle cx="10" cy="10" r="5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
      {/* specular highlight */}
      <circle cx="7" cy="6.5" r="2.4" fill="rgba(255,255,255,0.6)" />
      <text x="10" y="13.5" textAnchor="middle" fontSize="9" fontWeight="900" fill="#7a4a00">$</text>
    </svg>
  );
}

function CoinBurst() {
  const coins = Array.from({ length: 16 });
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      {/* radial gold flash */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(255,198,61,0.75), transparent 68%)" }}
        initial={{ scale: 0.2, opacity: 0.95 }}
        animate={{ scale: 2.6, opacity: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />
      {/* expanding ring */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
        style={{ borderColor: "rgba(255,198,61,0.9)" }}
        initial={{ scale: 0.3, opacity: 0.9 }}
        animate={{ scale: 2.4, opacity: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      />
      {/* flying coins with a slight gravity arc */}
      {coins.map((_, i) => {
        const ang = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
        const dist = 95 + Math.random() * 55;
        const x = Math.cos(ang) * dist;
        const y = Math.sin(ang) * dist;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{ marginLeft: -10, marginTop: -10 }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x,
              y: [0, y - 24, y + 34],
              scale: [0, 1.1, 0.85],
              opacity: [1, 1, 0],
              rotate: Math.random() * 540 - 270,
            }}
            transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
          >
            <CoinChip />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Main widget ──────────────────────────────────────────────── */
export default function SpinWheelWidget({ loggedIn = false }: { loggedIn?: boolean }) {
  const reduce  = useReducedMotion();
  const [open,     setOpen]     = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result,   setResult]   = useState<string | null>(null);
  // null = not yet checked (avoids a flash); true = spin ready; false = on cooldown
  const [available, setAvailable] = useState<boolean | null>(null);

  // Check the daily cooldown on mount; auto-reappear when it elapses.
  useEffect(() => {
    let last = 0;
    try { last = Number(localStorage.getItem(SPIN_KEY) || 0); } catch { /* ignore */ }
    const remaining = last ? last + COOLDOWN_MS - Date.now() : 0;
    if (remaining <= 0) {
      setAvailable(true);
      return;
    }
    setAvailable(false);
    const id = setTimeout(() => setAvailable(true), remaining);
    return () => clearTimeout(id);
  }, []);

  // Let other UI (e.g. the Menu's "Spin Wheel") open the wheel.
  useEffect(() => {
    const openIt = () => { setResult(null); setOpen(true); };
    window.addEventListener("juwa:open-spin", openIt);
    return () => window.removeEventListener("juwa:open-spin", openIt);
  }, []);

  // Human-readable time until the next spin (for the cooldown message).
  function cooldownLabel() {
    try {
      const last = Number(localStorage.getItem(SPIN_KEY) || 0);
      const ms = last + COOLDOWN_MS - Date.now();
      if (ms <= 0) return "";
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    } catch {
      return "";
    }
  }

  function spin() {
    if (spinning || available === false) return;
    // Consume today's spin — hide the widget until the cooldown elapses.
    try { localStorage.setItem(SPIN_KEY, String(Date.now())); } catch { /* ignore */ }
    setAvailable(false);
    setResult(null);
    setSpinning(true);
    sfxSpin();
    haptic(18);
    const winner = Math.floor(Math.random() * N);
    const target = 360 * 5 + (360 - winner * SEG - SEG / 2);
    setRotation(prev => prev - (prev % 360) + target);

    if (reduce) {
      setSpinning(false);
      setResult(`${PRIZES[winner].label} ${PRIZES[winner].sub}`);
      sfxWin();
      return;
    }

    // decelerating mechanical ticks — each peg the flapper passes, slowing down
    let t = 0.05;
    let dt = 0.05;
    while (t < 4.35) {
      const at = t;
      setTimeout(() => { sfxTick(); haptic(5); }, at * 1000);
      t += dt;
      dt *= 1.16; // intervals grow → wheel slows
    }
  }

  function handleComplete() {
    if (!spinning) return;
    setSpinning(false);
    const idx = (N - Math.round(((rotation % 360) + SEG / 2) / SEG)) % N;
    const p   = PRIZES[(idx + N) % N];
    setResult(`${p.label} ${p.sub}`);
    // celebration: triumphant arpeggio + coin cascade + payout haptic
    sfxWin();
    [0, 110, 230, 360].forEach((d) => setTimeout(sfxCoin, d));
    haptic([0, 45, 35, 45, 35, 90]);
  }

  function openModal() { setResult(null); setOpen(true); }

  return (
    <>
      {/* ── PEEKING WHEEL (hidden while on cooldown) ─────────── */}
      <AnimatePresence>
        {!open && available && (
          <motion.div
            key="peek"
            initial={{ x: 150 }}
            animate={{ x: 75 }}
            exit={{ x: 150, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.8 }}
            onClick={openModal}
            aria-label="Open spin wheel"
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && openModal()}
            className="fixed right-0 z-40 cursor-pointer select-none bottom-[196px] md:bottom-auto md:top-[calc(50%_-_75px)]"
          >
            {/* outer glow halo — warm gold core + neon violet aura */}
            <div
              className="pointer-events-none absolute -inset-6 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(255,198,61,0.5) 0%, rgba(255,46,154,0.4) 32%, rgba(176,86,255,0.28) 55%, transparent 72%)",
                filter: "blur(26px)",
                animation: "peek-pulse 2.6s ease-in-out infinite",
              }}
            />

            {/* wheel */}
            <div className="relative h-[150px] w-[150px]">
              <WheelSVG
                rotation={0}
                spinning={false}
                onHubClick={openModal}
                idSuffix="peek"
                reduce={reduce}
                idle
              />
            </div>

            {/* TAP label on visible left edge */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 flex flex-col items-center gap-1.5"
              style={{ pointerEvents: "none" }}
            >
              {/* arrow */}
              <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
                <path d="M12 11H2M2 11L7 6M2 11L7 16"
                  stroke="#ffc63d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {/* "SPIN" badge */}
              <div
                style={{
                  background: "linear-gradient(180deg,#ff2e9a,#b056ff)",
                  boxShadow: "0 0 12px rgba(255,46,154,0.8)",
                  writingMode: "vertical-rl",
                  borderRadius: "99px",
                  padding: "6px 4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-sora,sans-serif)",
                    fontWeight: 900,
                    fontSize: "9px",
                    letterSpacing: "0.18em",
                    color: "#fff",
                    textTransform: "uppercase",
                  }}
                >
                  SPIN
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL ───────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="bd"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
              onClick={() => !spinning && setOpen(false)}
            />

            <motion.div
              key="panel"
              initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-[380px] -translate-y-1/2 rounded-3xl p-5"
              style={{
                background: "linear-gradient(155deg,#130828 0%,#0d0620 55%,#1a0834 100%)",
                border: "1px solid rgba(255,46,154,0.2)",
                boxShadow: [
                  "0 0 0 1px rgba(176,86,255,0.15)",
                  "0 40px 120px -20px rgba(255,46,154,0.55)",
                  "inset 0 1px 0 rgba(255,255,255,0.08)",
                ].join(","),
              }}
            >
              {/* header */}
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#ff2e9a" }}>
                    Daily Reward
                  </p>
                  <h2 className="font-display text-xl font-extrabold text-white">
                    Spin &amp; Win
                  </h2>
                </div>
                <button
                  onClick={() => !spinning && setOpen(false)}
                  aria-label="Close spin wheel"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/10"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                >
                  <X className="h-4 w-4 text-white/60" />
                </button>
              </div>

              {/* wheel */}
              <div className="relative mx-auto h-[280px] w-[280px]">
                <div
                  className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle, rgba(255,46,154,0.45), rgba(176,86,255,0.3) 45%, transparent 70%)",
                    filter: "blur(24px)",
                    opacity: spinning ? 1 : 0.55,
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
                {result && !reduce && <CoinBurst key={result} />}
              </div>

              {/* CTA / result */}
              <div className="mt-5 text-center">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key="win"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <p
                        className="font-display text-2xl font-extrabold uppercase tracking-wide"
                        style={{ color: "#ffc63d", textShadow: "0 0 24px #ffc63d, 0 0 48px #ffc63d66" }}
                      >
                        You won {result}!
                      </p>

                      {loggedIn ? (
                        <>
                          <p className="mt-1 text-xs text-white/40">Prize added to your account</p>
                          <button
                            onClick={() => setOpen(false)}
                            className="mt-4 cursor-pointer text-xs text-white/30 underline-offset-2 transition-colors hover:text-white/60 hover:underline"
                          >
                            Come back tomorrow for another spin
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="mt-1 text-xs text-white/50">
                            Create a free account to claim it
                          </p>
                          <Link
                            href={`/signup?prize=${encodeURIComponent(result)}`}
                            onClick={() => setOpen(false)}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-4 font-display text-base font-extrabold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                            style={{
                              background: "linear-gradient(135deg,#ff2e9a,#b056ff)",
                              boxShadow: "0 8px 32px -8px rgba(255,46,154,0.8), inset 0 1px 0 rgba(255,255,255,0.2)",
                            }}
                          >
                            <Sparkles className="h-4 w-4" />
                            Claim My Prize
                          </Link>
                          <p className="mt-3 text-[11px] text-white/40">
                            Already a member?{" "}
                            <Link
                              href="/login"
                              onClick={() => setOpen(false)}
                              className="font-bold text-magenta hover:text-cyan"
                            >
                              Log in
                            </Link>
                          </p>
                        </>
                      )}
                    </motion.div>
                  ) : available === false ? (
                    <motion.div key="cooldown" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <p
                        className="font-display text-2xl font-extrabold uppercase tracking-wide text-gold"
                        style={{ textShadow: "0 0 22px rgba(255,198,61,0.5)" }}
                      >
                        Come back tomorrow!
                      </p>
                      <p className="mx-auto mt-1 max-w-[16rem] text-xs text-white/50">
                        You&apos;ve used today&apos;s free spin.
                        {cooldownLabel() ? ` Next spin in ${cooldownLabel()}.` : ""}
                      </p>
                      <button
                        onClick={() => setOpen(false)}
                        className="mt-4 w-full cursor-pointer rounded-2xl py-4 font-display text-base font-extrabold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
                        style={{
                          background: "linear-gradient(135deg,#ff2e9a,#b056ff)",
                          boxShadow: "0 8px 32px -8px rgba(255,46,154,0.8), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }}
                      >
                        Got it
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <button
                        onClick={spin}
                        disabled={spinning}
                        className="w-full cursor-pointer rounded-2xl py-4 font-display text-base font-extrabold uppercase tracking-wide text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          background: "linear-gradient(135deg,#ff2e9a,#b056ff)",
                          boxShadow: "0 8px 32px -8px rgba(255,46,154,0.8), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }}
                      >
                        {spinning ? "Spinning…" : "Spin the Wheel"}
                      </button>
                      <p className="mt-3 text-[11px] text-white/30">
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
          0%,100% { opacity:0.55; transform:scale(1);   }
          50%      { opacity:1;    transform:scale(1.06); }
        }
        @keyframes bulb-chase {
          0%       { opacity:0.35; }
          6%       { opacity:1;    }
          18%      { opacity:0.35; }
          100%     { opacity:0.35; }
        }
        @keyframes pointer-tick {
          0%   { transform: rotate(0deg);  }
          50%  { transform: rotate(-8deg); }
          100% { transform: rotate(0deg);  }
        }
      `}</style>
    </>
  );
}
