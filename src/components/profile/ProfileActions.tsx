"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function ProfileActions() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3.5 font-display font-bold text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
