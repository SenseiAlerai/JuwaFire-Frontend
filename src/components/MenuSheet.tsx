"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import {
  X, Headphones, LogIn, UserPlus,
  Disc3, Gift, Rocket, Cherry, Zap, Dice5, Ticket, LayoutGrid, Hash,
  Fish, Crosshair, Sparkles, Gamepad2, Crown, Users, Heart,
} from "lucide-react";

/* Mirrors OrionStars' menu drawer, mapped to our routes. */
const FEATURED = [
  { href: "/promotions", label: "Spin Wheel", icon: Disc3, color: "#ffc63d" },
  { href: "/promotions", label: "Promotion", icon: Gift, color: "#ff2e9a" },
];

const CATEGORIES = [
  { href: "/games", label: "Crash Game", icon: Rocket },
  { href: "/games", label: "Slots", icon: Cherry },
  { href: "/games", label: "Instant Win", icon: Zap },
  { href: "/games", label: "Table Games", icon: Dice5 },
  { href: "/games", label: "Scratch Cards", icon: Ticket },
  { href: "/games", label: "Keno", icon: LayoutGrid },
  { href: "/games", label: "Bingo", icon: Hash },
  { href: "/games", label: "Fishing", icon: Fish },
  { href: "/games", label: "Shooting", icon: Crosshair },
];

const MORE = [
  { href: "/games", label: "Sweepstake Games", icon: Sparkles },
  { href: "/games", label: "Platforms", icon: Gamepad2 },
  { href: "/vip", label: "VIP Rewards", icon: Crown },
  { href: "/promotions", label: "Refer & Earn", icon: Users },
  { href: "/games", label: "Favorites", icon: Heart },
];

export default function MenuSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-[61] flex max-h-[85vh] flex-col rounded-t-[2rem] border-t border-white/10 bg-[rgba(10,12,26,0.98)] shadow-[0_-20px_60px_-20px_rgba(176,86,255,0.5)]"
          >
            {/* header */}
            <div className="px-5 pt-4">
              <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-white/15" />
              <div className="flex items-center justify-between px-1">
                <h2 className="font-display text-xl font-extrabold text-ink">Menu</h2>
                <button
                  onClick={onClose}
                  aria-label="Close menu"
                  className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/8 text-ink-soft transition-colors hover:bg-white/12 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* scrollable body */}
            <div className="no-scrollbar overflow-y-auto px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
              {/* featured */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                {FEATURED.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={onClose}
                      className="candy-card flex items-center gap-3 rounded-2xl p-3.5 transition-transform active:scale-95"
                    >
                      <span
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
                        style={{ background: `${l.color}26`, boxShadow: `0 0 18px ${l.color}44` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: l.color }} />
                      </span>
                      <span className="font-display text-sm font-bold text-ink">{l.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* game categories */}
              <p className="mt-5 px-1 font-display text-xs font-bold uppercase tracking-widest text-ink-soft">
                Game Category
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {CATEGORIES.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={onClose}
                      className="flex flex-col items-center gap-1.5 rounded-2xl border border-white/8 bg-white/4 p-3 text-center transition-colors active:scale-95 hover:bg-white/8"
                    >
                      <Icon className="h-5 w-5 text-ink-soft" />
                      <span className="text-[11px] font-semibold leading-tight text-ink">
                        {l.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* more */}
              <div className="mt-4 flex flex-col gap-1">
                {MORE.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link
                      key={l.label}
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/8"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/6 text-ink-soft">
                        <Icon className="h-4.5 w-4.5" />
                      </span>
                      <span className="font-display text-sm font-bold text-ink">{l.label}</span>
                    </Link>
                  );
                })}
                <a
                  href="https://wa.me/10000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/8"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/6 text-ink-soft">
                    <Headphones className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-display text-sm font-bold text-ink">24/7 Support</span>
                </a>
              </div>

              {/* auth */}
              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 font-display font-bold text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
                >
                  <LogIn className="h-4 w-4" />
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-3 font-display font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,46,154,0.9)] transition-transform active:scale-95"
                >
                  <UserPlus className="h-4 w-4" />
                  Join
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
