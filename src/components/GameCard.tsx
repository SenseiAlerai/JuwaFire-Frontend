"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Play, Sparkles, LogIn } from "lucide-react";
import type { Game } from "@/lib/data";
import { useGameAccounts } from "./games/GameAccountsProvider";

export default function GameCard({
  game,
  index = 0,
  noReveal = false,
}: {
  game: Game;
  index?: number;
  noReveal?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { loggedIn, accounts, openGame } = useGameAccounts();
  const account = accounts[game.name];

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 220, damping: 18 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 220, damping: 18 });

  function onMove(e: React.MouseEvent) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }
  function onLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  // CTA state
  const cta = !loggedIn
    ? { label: "Log in to play", Icon: LogIn, cls: "border border-white/25 bg-white/10 text-white" }
    : account
      ? { label: "Play", Icon: Play, cls: "bg-[linear-gradient(135deg,#aaff3c,#2de2ff)] text-[#0a1402]" }
      : { label: "Set Up", Icon: Sparkles, cls: "bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white" };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => openGame(game)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openGame(game)}
      role="button"
      tabIndex={0}
      aria-label={`${game.name} — ${cta.label}`}
      initial={noReveal ? false : { opacity: 0, y: 24 }}
      whileInView={noReveal ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative block aspect-[3/4] w-full cursor-pointer rounded-2xl [transform-style:preserve-3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
    >
      <span
        className="pointer-events-none absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
        style={{ background: game.accent }}
      />

      <span className="absolute inset-0 overflow-hidden rounded-2xl border border-white/12 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.85)] transition-colors duration-300 group-hover:border-white/30">
        <Image
          src={game.image}
          alt={game.name}
          fill
          sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 180px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/25" />
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.22)_50%,transparent_65%)] bg-[length:200%_100%] [background-position:200%_0] transition-[background-position] duration-700 group-hover:[background-position:-200%_0]" />

        {/* badges */}
        {game.badge && (
          <span
            className="absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white ring-1 ring-white/25 backdrop-blur-sm"
            style={{ background: `${game.badge.color}cc` }}
          >
            {game.badge.label}
          </span>
        )}
        {loggedIn && account && (
          <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-lime/20 px-2.5 py-1 text-[11px] font-bold text-lime ring-1 ring-lime/30 backdrop-blur-sm">
            Active
          </span>
        )}

        {/* title */}
        <span
          className="absolute inset-x-0 bottom-0 p-3.5 pb-14 transition-transform duration-300 md:pb-3.5 md:group-hover:-translate-y-12"
          style={{ transform: "translateZ(18px)" }}
        >
          <span className="block font-display text-base font-bold leading-tight text-white drop-shadow sm:text-lg">
            {game.name}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: game.accent, boxShadow: `0 0 8px ${game.accent}` }}
            />
            <span className="text-xs font-semibold text-white/80 sm:text-sm">{game.subtitle}</span>
          </span>
        </span>

        {/* CTA — always visible on mobile, hover/focus reveal on desktop */}
        <span
          className={`absolute inset-x-2.5 bottom-2.5 z-10 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-bold transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 ${cta.cls}`}
          style={{ transform: "translateZ(24px)" }}
        >
          <cta.Icon className="h-3.5 w-3.5" />
          {cta.label}
        </span>
      </span>
    </motion.div>
  );
}
