"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ChevronDown, User, Wallet, LogOut } from "lucide-react";

/** Username-initial avatar with a dropdown (Profile / Wallet / Sign out). */
export default function UserMenu({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const initial = (name.trim()[0] ?? "P").toUpperCase();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-0.5 rounded-full outline-none"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] font-display text-sm font-extrabold text-white ring-2 ring-gold/60">
          {initial}
        </span>
        <ChevronDown className={`h-4 w-4 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-white/12 bg-[rgba(12,10,26,0.98)] p-1.5 shadow-[0_20px_60px_-16px_rgba(0,0,0,0.9)]">
          <p className="truncate px-3 py-2 text-xs font-semibold text-ink-soft">@{name}</p>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/10"
          >
            <User className="h-4 w-4 text-ink-soft" /> Profile
          </Link>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white/10"
          >
            <Wallet className="h-4 w-4 text-ink-soft" /> Wallet
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red transition-colors hover:bg-red/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
