"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  X, Headphones, LogIn, UserPlus,
  Disc3, Gift, Rocket, Cherry, Zap, Dice5, Ticket, LayoutGrid, Hash,
  Fish, Crosshair, Sparkles, Gamepad2, Crown, Users, Heart,
} from "lucide-react";

/* Mirrors OrionStars' left sidebar menu, mapped to our routes. */
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
  { href: "/refer", label: "Refer & Earn", icon: Users },
  { href: "/games", label: "Favorites", icon: Heart },
];

function Row({
  href, label, Icon, color, onClose,
}: {
  href: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color?: string;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8 active:bg-white/10"
    >
      <span
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
        style={
          color
            ? { background: `${color}26`, boxShadow: `0 0 14px ${color}33` }
            : { background: "rgba(255,255,255,0.06)" }
        }
      >
        <Icon className="h-4.5 w-4.5" style={color ? { color } : { color: "#b6a3d8" }} />
      </span>
      <span className="font-display text-sm font-bold text-ink">{label}</span>
    </Link>
  );
}

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
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 340, damping: 34 }}
            className="fixed bottom-0 left-0 top-0 z-[61] flex w-[300px] max-w-[84vw] flex-col border-r border-white/10 bg-[#080a16] shadow-[20px_0_60px_-20px_rgba(0,0,0,0.9)]"
          >
            {/* header */}
            <div className="flex items-center justify-between px-4 pb-2 pt-4">
              <Image
                src="/juwafire-logo.png"
                alt="JuwaFire"
                width={1024}
                height={1024}
                className="h-auto w-[86px] drop-shadow-[0_0_14px_rgba(255,46,154,0.3)]"
              />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/8 text-ink-soft transition-colors hover:bg-white/12 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* scrollable vertical nav */}
            <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4">
              {FEATURED.map((l) => (
                <Row key={l.label} href={l.href} label={l.label} Icon={l.icon} color={l.color} onClose={onClose} />
              ))}

              <p className="mt-4 px-3 pb-1 font-display text-[11px] font-bold uppercase tracking-widest text-ink-soft">
                Game Category
              </p>
              {CATEGORIES.map((l) => (
                <Row key={l.label} href={l.href} label={l.label} Icon={l.icon} onClose={onClose} />
              ))}

              <p className="mt-4 px-3 pb-1 font-display text-[11px] font-bold uppercase tracking-widest text-ink-soft">
                More
              </p>
              {MORE.map((l) => (
                <Row key={l.label} href={l.href} label={l.label} Icon={l.icon} onClose={onClose} />
              ))}

              <a
                href="https://wa.me/10000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/6">
                  <Headphones className="h-4.5 w-4.5 text-ink-soft" />
                </span>
                <span className="font-display text-sm font-bold text-ink">24/7 Support</span>
              </a>
            </div>

            {/* auth pinned at bottom */}
            <div className="grid grid-cols-2 gap-2 border-t border-white/8 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 font-display text-sm font-bold text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
              >
                <LogIn className="h-4 w-4" />
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-2.5 font-display text-sm font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,46,154,0.9)] transition-transform active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                Join
              </Link>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
