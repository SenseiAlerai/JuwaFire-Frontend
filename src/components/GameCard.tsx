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
import { Play } from "lucide-react";
import type { Game } from "@/lib/data";

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
  const ref = useRef<HTMLAnchorElement>(null);

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

  return (
    <motion.a
      ref={ref}
      href={game.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={noReveal ? false : { opacity: 0, y: 24 }}
      whileInView={noReveal ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: (index % 6) * 0.05, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={reduce ? undefined : { y: -6, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="group relative block aspect-[3/4] w-full cursor-pointer rounded-2xl [transform-style:preserve-3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan/70"
      aria-label={`Play ${game.name}`}
    >
      {/* accent glow that blooms on hover */}
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
        {/* readability gradient */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/25" />
        {/* sheen sweep */}
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
        <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-black/35 px-2.5 py-1 text-[11px] font-semibold text-white/90 ring-1 ring-white/10 backdrop-blur-sm">
          {game.category}
        </span>

        {/* title block */}
        <span className="absolute inset-x-0 bottom-0 p-3.5" style={{ transform: "translateZ(18px)" }}>
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

        {/* play button on hover */}
        <span className="absolute bottom-3.5 right-3.5 z-10 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-white text-[#12081f] opacity-0 shadow-[0_0_24px_rgba(255,255,255,0.75)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </span>
    </motion.a>
  );
}
