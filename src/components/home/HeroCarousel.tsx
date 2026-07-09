"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Slide = {
  key: string;
  mascot: string;
  eyebrow: string;
  title: string;
  cta: string;
  href: string;
  c1: string; // headline-side color
  c2: string; // mid color (fades toward near-black under the mascot)
};

const SLIDES: Slide[] = [
  { key: "welcome", mascot: "/mascot/mascot-blaze-dragon.png", eyebrow: "On your first deposit", title: "Get 20% Bonus", cta: "Claim Now", href: "/store", c1: "#ff2e9a", c2: "#7a0c4a" },
  { key: "spin", mascot: "/mascot/mascot-blaze-goofy.png", eyebrow: "Every single day", title: "Daily Free Spin", cta: "Spin Now", href: "/", c1: "#ff9a1f", c2: "#7a2c0c" },
  { key: "refer", mascot: "/mascot/mascot-blaze-dragons-duo.png", eyebrow: "Friend deposits $10+", title: "Refer & Earn $10", cta: "Invite Now", href: "/refer", c1: "#12b8c8", c2: "#0a3a6a" },
  { key: "vip", mascot: "/mascot/mascot-blaze-dragon.png", eyebrow: "Play & climb the ranks", title: "Join the VIP Club", cta: "Learn More", href: "/vip", c1: "#b056ff", c2: "#3a0a5a" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % n), 5000);
    return () => clearInterval(id);
  }, [n]);

  const s = SLIDES[i];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative aspect-[2/1] overflow-hidden rounded-[1.75rem] border border-white/12 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)]">
        <AnimatePresence initial={false}>
          <motion.div
            key={s.key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
            style={{ background: `linear-gradient(100deg, ${s.c1} 0%, ${s.c2} 42%, #07070e 74%)` }}
          >
            <Link href={s.href} className="block h-full w-full">
              {/* mascot — dark bg blends into the gradient; left edge masked so it fades in */}
              <Image
                src={s.mascot}
                alt=""
                width={600}
                height={900}
                priority
                className="absolute bottom-0 right-0 h-full w-auto object-contain object-bottom [mask-image:linear-gradient(90deg,transparent,#000_38%)]"
              />

              {/* text */}
              <div className="absolute inset-y-0 left-0 flex max-w-[62%] flex-col justify-center px-5 sm:px-8">
                <span className="font-display text-[11px] font-bold uppercase tracking-widest text-white/85 sm:text-xs">
                  {s.eyebrow}
                </span>
                <span className="mt-1 font-display text-2xl font-extrabold uppercase leading-[0.95] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:text-4xl">
                  {s.title}
                </span>
                <span className="mt-3 inline-flex w-fit items-center rounded-xl bg-[linear-gradient(135deg,#ffd64d,#ff7a2f)] px-4 py-2 font-display text-sm font-extrabold text-[#1a0e02] shadow-[0_8px_22px_-8px_rgba(0,0,0,0.7)] sm:px-5 sm:py-2.5">
                  {s.cta}
                </span>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dots */}
      <div className="mt-2.5 flex justify-center gap-1.5">
        {SLIDES.map((_, d) => (
          <button
            key={d}
            onClick={() => setI(d)}
            aria-label={`Go to slide ${d + 1}`}
            className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-magenta" : "w-1.5 bg-white/25"}`}
          />
        ))}
      </div>
    </div>
  );
}
