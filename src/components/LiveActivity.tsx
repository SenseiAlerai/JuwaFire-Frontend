"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { GAMES } from "@/lib/data";
import { sfxWin } from "@/lib/sound";

// Simulated live floor activity — a winner card pops in periodically so the
// room always feels populated. Fabricated (like the static winner ticker).
const NAMES = [
  "Jor****", "Tas****", "Kev****", "Aal****", "Mar****", "Des****",
  "Car****", "Bri****", "Dev****", "Sop****", "Tyl****", "Ima****",
  "And****", "Chl****", "Mal****", "Gab****", "Osba****", "Luck****",
];

type Win = { name: string; amount: string; game: string; image: string };

const rand = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

export default function LiveActivity() {
  const [win, setWin] = useState<Win | null>(null);

  useEffect(() => {
    let showTimer: ReturnType<typeof setTimeout>;
    let hideTimer: ReturnType<typeof setTimeout>;

    function fire() {
      const g = rand(GAMES);
      const amount = (Math.random() * 950 + 40).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      setWin({ name: rand(NAMES), amount, game: g.name, image: g.image });
      sfxWin();
      hideTimer = setTimeout(() => setWin(null), 5200);
      showTimer = setTimeout(fire, 10000 + Math.random() * 12000);
    }

    showTimer = setTimeout(fire, 4500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {win && (
        <motion.div
          key={`${win.name}-${win.amount}`}
          initial={{ opacity: 0, x: -48 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -48 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed bottom-24 left-3 z-40 max-w-[82vw] sm:max-w-xs md:bottom-6"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/12 bg-[rgba(12,14,26,0.96)] p-2.5 pr-4 shadow-[0_18px_44px_-16px_rgba(0,0,0,0.9)] backdrop-blur-sm">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-white/12">
              <Image src={win.image} alt={win.game} fill sizes="44px" className="object-cover" />
            </span>
            <div className="min-w-0">
              <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-lime">
                <span className="h-2 w-2 rounded-full bg-lime shadow-[0_0_8px_#aaff3c]" /> Live
              </span>
              <p className="truncate text-sm text-ink">
                <span className="font-bold">{win.name}</span> won{" "}
                <span className="font-bold text-gold">{win.amount} SC</span> in{" "}
                <span className="font-semibold text-magenta">{win.game}</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
