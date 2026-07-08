"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQ = [
  {
    q: "Why should I become a VIP Club member?",
    a: "As you play, you earn VIP Points and climb the ranks. Every rank unlocks bigger withdrawal limits, level-up coin rewards, and exclusive perks — the more you play, the more you get back.",
  },
  {
    q: "How do I join VIP Club?",
    a: "It's automatic. Create an account and start playing — every coin you play earns VIP Points and moves you up the ranks. Nothing to sign up for.",
  },
  {
    q: "What is the Coins Back reward?",
    a: "Coins Back is a reward you earn based on your play. Higher VIP ranks earn bigger rewards, credited straight to your wallet.",
  },
  {
    q: "How to get Coins Back?",
    a: "Just play. Your VIP rank sets your reward level, and level-up rewards are added to your wallet automatically as you climb.",
  },
  {
    q: "How is my Coins Back reward calculated?",
    a: "It's based on your VIP rank and total qualifying play (coins played). Each rank has its own reward — see the Levels above.",
  },
  {
    q: "What are Exclusive Offers?",
    a: "Higher ranks unlock special promotions, bigger bonuses, and priority support reserved for VIP members.",
  },
];

export default function VipFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto mt-6 max-w-2xl space-y-3">
      {FAQ.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="candy-card overflow-hidden rounded-2xl">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-bold text-ink">{f.q}</span>
              <ChevronDown className={`h-5 w-5 shrink-0 text-ink-soft transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && <p className="px-5 pb-5 text-sm text-ink-soft">{f.a}</p>}
          </div>
        );
      })}
    </div>
  );
}
