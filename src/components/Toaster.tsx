"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X, Info, Trophy } from "lucide-react";
import type { ToastDetail, ToastType } from "@/lib/toast";

const STYLES: Record<ToastType, { ring: string; icon: typeof Check; tint: string }> = {
  success: { ring: "ring-lime/40", icon: Check, tint: "text-lime" },
  error: { ring: "ring-red/40", icon: X, tint: "text-red" },
  info: { ring: "ring-violet/40", icon: Info, tint: "text-cyan" },
  win: { ring: "ring-gold/50", icon: Trophy, tint: "text-gold" },
};

export default function Toaster() {
  const [toasts, setToasts] = useState<ToastDetail[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent<ToastDetail>).detail;
      setToasts((t) => [...t, detail]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== detail.id));
      }, 3600);
    }
    window.addEventListener("juwa:toast", onToast);
    return () => window.removeEventListener("juwa:toast", onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[70] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const s = STYLES[t.type];
          const Icon = s.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`pointer-events-auto flex w-full items-center gap-3 rounded-2xl border border-white/12 bg-[rgba(18,10,32,0.92)] px-4 py-3 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.8)] ring-1 backdrop-blur-xl ${s.ring}`}
            >
              <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/8 ${s.tint}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-display text-sm font-semibold text-ink">{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
