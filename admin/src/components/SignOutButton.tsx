"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="btn border border-line px-3 py-1.5 text-ink-soft hover:text-ink"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
