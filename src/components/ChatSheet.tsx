"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Send } from "lucide-react";
import { CHANNELS } from "@/lib/supportChannels";

export default function ChatSheet({
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
              <h2 className="font-display text-xl font-extrabold text-ink">
                24/7 Support — reply in minutes
              </h2>
              <button
                onClick={onClose}
                aria-label="Close chat"
                className="grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white/8 text-ink-soft transition-colors hover:bg-white/12 hover:text-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              {CHANNELS.map((c) => (
                <a
                  key={c.name}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white/8"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white"
                    style={{ background: c.color }}
                  >
                    <c.Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="font-display font-semibold text-ink">{c.name}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
