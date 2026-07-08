"use client";

import { useState } from "react";
import { Copy, Check, Share2, Users } from "lucide-react";

export default function ReferCard({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  async function share() {
    const data = {
      title: "JuwaFire",
      text: "Join me on JuwaFire and we both get $10! 🎰",
      url: link,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch {
      /* user cancelled or unsupported — fall through to copy */
    }
    copy();
  }

  return (
    <div className="candy-card relative overflow-hidden rounded-[2rem] p-6 text-center sm:p-8">
      {/* glow */}
      <div className="pointer-events-none absolute -top-16 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-magenta/40 blur-3xl" />

      <span className="relative inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 font-display text-sm font-semibold text-ink">
        <Users className="h-4 w-4 text-magenta" /> Refer a Friend
      </span>

      <h2 className="shine-text relative mx-auto mt-5 max-w-sm font-display text-3xl font-extrabold uppercase leading-tight tracking-tight sm:text-4xl">
        Refer Friends &amp; Get <span className="text-lime">$10</span>
      </h2>
      <p className="relative mt-3 font-semibold text-ink-soft">
        Earn <span className="font-bold text-ink">$10</span> for every friend who deposits{" "}
        <span className="font-bold text-ink">$10+</span>
      </p>

      {/* link + copy */}
      <div className="relative mt-5 flex items-center gap-2 rounded-2xl border border-white/12 bg-white/5 p-1.5">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="Referral link"
          className="min-w-0 flex-1 truncate bg-transparent px-3 py-2 text-sm font-medium text-ink outline-none"
        />
        <button
          onClick={copy}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 font-display text-sm font-bold text-gold transition-transform active:scale-95 hover:bg-white/15"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* share */}
      <button
        onClick={share}
        className="relative mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#ffc63d,#ff5c3b)] py-3.5 font-display text-lg font-extrabold text-[#1a0e02] shadow-[0_10px_30px_-8px_rgba(255,122,47,0.7)] transition-transform active:scale-[0.98]"
      >
        <Share2 className="h-5 w-5" /> Share
      </button>
    </div>
  );
}
