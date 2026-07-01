"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, X } from "lucide-react";
import { CHANNELS } from "@/lib/supportChannels";

/** Floating support launcher — desktop only (mobile uses the Chat tab in the bottom nav). */
export default function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-3 z-40 hidden flex-col items-end gap-3 md:flex">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="candy-card w-60 rounded-3xl p-4"
          >
            <p className="px-1 pb-2 font-display text-sm font-bold text-ink">
              24/7 Support — reply in minutes
            </p>
            <div className="flex flex-col gap-1.5">
              {CHANNELS.map((c) => (
                <a
                  key={c.name}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/8"
                >
                  <span
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: c.color }}
                  >
                    <c.Icon className="h-4 w-4" />
                  </span>
                  <span className="font-display font-semibold text-ink">{c.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close support" : "Open support"}
        aria-expanded={open}
        className="grid h-14 w-14 cursor-pointer place-items-center rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] text-white shadow-[0_10px_30px_-8px_rgba(255,46,154,0.9)] transition-transform hover:scale-105 active:scale-90"
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <X className="h-6 w-6" />
          </motion.span>
        ) : (
          <motion.span key="h" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
            <Headphones className="h-6 w-6" />
          </motion.span>
        )}
      </AnimatePresence>
      </button>
    </div>
  );
}
