"use client";

import { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

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

  const msg = encodeURIComponent(`Join me on JuwaFire and we both get $10! ${link}`);
  const shares = [
    { name: "WhatsApp", href: `https://wa.me/?text=${msg}`, color: "#25D366" },
    { name: "Telegram", href: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${msg}`, color: "#2AABEE" },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${msg}`, color: "#000000" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, color: "#1877F2" },
  ];

  return (
    <div className="candy-card rounded-[2rem] p-6 sm:p-8">
      <p className="font-display text-sm font-bold uppercase tracking-widest text-magenta">
        Your referral link
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 truncate rounded-xl border border-white/12 bg-white/5 px-4 py-3 font-medium text-ink outline-none"
          aria-label="Referral link"
        />
        <button
          onClick={copy}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] px-5 py-3 font-display font-bold text-white transition-transform active:scale-95"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mt-5">
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
          <Share2 className="h-4 w-4" /> Share it
        </p>
        <div className="flex flex-wrap gap-2">
          {shares.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-4 py-2 font-display text-sm font-bold text-white transition-transform active:scale-95"
              style={{ background: s.color }}
            >
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
