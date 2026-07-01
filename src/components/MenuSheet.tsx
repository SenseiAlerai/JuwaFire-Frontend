"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, Gamepad2, Gift, Crown, Home, Headphones, LogIn, UserPlus } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/games", label: "Games", icon: Gamepad2 },
  { href: "/promotions", label: "Bonuses & Drops", icon: Gift },
  { href: "/vip", label: "VIP Tiers", icon: Crown },
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
            className="fixed inset-x-0 bottom-0 z-[61] rounded-t-[2rem] border-t border-white/10 bg-[rgba(16,9,28,0.98)] p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(176,86,255,0.5)]"
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />
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

            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {LINKS.map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className="candy-card flex flex-col items-center gap-2 rounded-2xl p-4 text-center transition-transform active:scale-95"
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/8 text-ink">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-sm font-bold text-ink">{l.label}</span>
                  </Link>
                );
              })}
            </div>

            <a
              href="https://wa.me/10000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/8"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 text-ink">
                <Headphones className="h-5 w-5" />
              </span>
              <span className="font-display font-bold text-ink">24/7 Support</span>
            </a>

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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
