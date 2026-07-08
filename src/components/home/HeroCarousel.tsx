"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

type Slide =
  | { type: "image"; src: string; alt: string; href: string }
  | { type: "text"; eyebrow: string; title: string; href: string; from: string; to: string };

const SLIDES: Slide[] = [
  { type: "image", src: "/banner-welcome.jpg", alt: "Welcome to JuwaFire — 20% first deposit bonus", href: "/store" },
  { type: "text", eyebrow: "Fast Withdrawals", title: "24/7 Instant Redeem", href: "/cashout", from: "#ff3b5c", to: "#7a0c1f" },
  { type: "text", eyebrow: "Bring a friend", title: "Refer & Earn $10", href: "/refer", from: "#b056ff", to: "#2a0a3f" },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % n), 4500);
    return () => clearInterval(id);
  }, [n]);

  const slide = SLIDES[i];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative aspect-[2/1] overflow-hidden rounded-[1.75rem] border border-white/12 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <Link href={slide.href} className="block h-full w-full">
              {slide.type === "image" ? (
                <Image src={slide.src} alt={slide.alt} fill priority sizes="(max-width:768px) 100vw, 768px" className="object-cover" />
              ) : (
                <div
                  className="flex h-full w-full flex-col justify-center px-6"
                  style={{ background: `linear-gradient(120deg, ${slide.from}, ${slide.to})` }}
                >
                  <span className="font-display text-xs font-bold uppercase tracking-widest text-white/80">
                    {slide.eyebrow}
                  </span>
                  <span className="mt-1 font-display text-3xl font-extrabold uppercase leading-none text-white drop-shadow sm:text-4xl">
                    {slide.title}
                  </span>
                </div>
              )}
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
