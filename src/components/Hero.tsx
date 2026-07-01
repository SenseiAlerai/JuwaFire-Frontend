"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Gift, Star } from "lucide-react";
import { CandyLink } from "./CandyButton";
import LiveCount from "./LiveCount";
import { GAMES } from "@/lib/data";

/* floating game posters that parallax with the cursor (desktop only) */
const FLOATERS = [
  { src: GAMES[0].image, cls: "left-[3%] top-[16%] h-24 w-24 xl:h-28 xl:w-28", rot: "-8deg", d: "0s", depth: 1 },
  { src: GAMES[2].image, cls: "right-[4%] top-[10%] h-28 w-28 xl:h-36 xl:w-36", rot: "7deg", d: "0.6s", depth: 1.5 },
  { src: GAMES[4].image, cls: "left-[8%] bottom-[6%] h-20 w-20 xl:h-24 xl:w-24", rot: "6deg", d: "1.2s", depth: 0.7 },
  { src: GAMES[6].image, cls: "right-[7%] bottom-[4%] h-24 w-24 xl:h-32 xl:w-32", rot: "-6deg", d: "0.3s", depth: 1.2 },
];

const AVATARS = ["#ff2e9a", "#b056ff", "#aaff3c", "#2de2ff"];

export default function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const px = useSpring(useTransform(mx, [0, 1], [-16, 16]), { stiffness: 120, damping: 20 });
  const py = useSpring(useTransform(my, [0, 1], [-12, 12]), { stiffness: 120, damping: 20 });

  function onMove(e: React.MouseEvent) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <section
      onMouseMove={reduce ? undefined : onMove}
      className="relative overflow-hidden px-4 pb-6 pt-6 sm:pt-10"
    >
      {/* ── animated aurora backdrop ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-6%] h-[520px] w-[820px] max-w-[95vw] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
          style={{ background: "radial-gradient(circle,rgba(255,46,154,0.5),transparent 62%)", animation: "var(--animate-aurora)" }}
        />
        <div
          className="absolute -left-24 top-24 h-[380px] w-[380px] rounded-full opacity-55 blur-3xl"
          style={{ background: "radial-gradient(circle,rgba(45,226,255,0.4),transparent 62%)", animation: "var(--animate-float)" }}
        />
        <div
          className="absolute -right-20 top-8 h-[440px] w-[440px] rounded-full opacity-55 blur-3xl"
          style={{ background: "radial-gradient(circle,rgba(176,86,255,0.45),transparent 62%)", animation: "var(--animate-float)", animationDelay: "1.5s" }}
        />
      </div>

      {/* ── parallax floating posters ── */}
      <motion.div
        aria-hidden
        style={{ x: px, y: py }}
        className="pointer-events-none absolute inset-0 -z-10 hidden lg:block"
      >
        {FLOATERS.map((f, i) => (
          <div
            key={i}
            className={`absolute ${f.cls}`}
            style={{ animation: "var(--animate-float)", animationDelay: f.d }}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl border border-white/15 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.85)]"
              style={{ transform: `rotate(${f.rot})` }}
            >
              <Image src={f.src} alt="" fill sizes="160px" className="object-cover opacity-90" />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* ── content ── */}
      <div className="mx-auto max-w-3xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="neon-chip inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display font-semibold text-ink"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime" />
          </span>
          <LiveCount base={18402} /> playing right now
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl"
        >
          <span className="block text-ink">Feel the rush at</span>
          <span className="block shine-text">JuwaFire</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-5 max-w-xl text-lg text-ink-soft"
        >
          100+ real game rooms, one login. Fund your wallet, jump straight in, and cash out your
          winnings in minutes — no downloads, no waiting.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <CandyLink href="/signup" variant="primary" size="lg">
            <Gift className="h-5 w-5" /> Claim 100% Bonus
          </CandyLink>
          <CandyLink href="/games" variant="ghost" size="lg">
            Enter the Games
          </CandyLink>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="mt-6 flex items-center justify-center gap-2 text-ink-soft"
        >
          <div className="flex -space-x-2">
            {AVATARS.map((c) => (
              <span key={c} className="h-7 w-7 rounded-full border-2 border-bg" style={{ background: c }} />
            ))}
          </div>
          <span className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <strong className="text-ink">4.9/5</strong> from 60k+ players
          </span>
        </motion.div>
      </div>
    </section>
  );
}
