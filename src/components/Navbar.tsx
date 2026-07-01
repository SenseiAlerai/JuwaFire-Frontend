"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { Wallet, LogOut } from "lucide-react";
import { CandyLink } from "./CandyButton";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/promotions", label: "Promos" },
  { href: "/vip", label: "VIP" },
];

type NavUser = {
  name?: string | null;
  username?: string | null;
  image?: string | null;
} | null;

export default function Navbar({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const displayName = user?.username || user?.name || "Player";

  return (
    <header className="sticky top-0 z-50 px-3 pt-2 sm:px-5 sm:pt-3">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-1 py-1 sm:px-2">
        <Link
          href="/"
          className="-ml-2 -mt-1.5 block shrink-0 sm:-ml-3 sm:-mt-2"
          aria-label="JuwaFire home"
        >
          <Image
            src="/juwafire-logo.png"
            alt="JuwaFire Sweepstakes Games"
            width={1024}
            height={1024}
            className="h-auto w-[102px] drop-shadow-[0_0_18px_rgba(255,46,154,0.35)] sm:w-[126px]"
            priority
          />
        </Link>

        {/* desktop section links (mobile uses the bottom tab bar instead) */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={cn(
                    "rounded-full px-4 py-2 font-display font-semibold transition-colors",
                    active
                      ? "bg-white/10 text-ink shadow-[0_0_18px_-4px_rgba(176,86,255,0.8)]"
                      : "text-ink-soft hover:bg-white/5 hover:text-ink",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* auth controls — visible on all sizes */}
        <div className="flex shrink-0 items-center gap-2">
          {user ? (
            <>
              <CandyLink href="/dashboard" variant="primary" size="sm">
                <Wallet className="h-4 w-4" />
                <span className="max-w-[7rem] truncate">{displayName}</span>
              </CandyLink>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                aria-label="Sign out"
                className="grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white/5 text-ink-soft transition-colors hover:bg-white/10 hover:text-ink"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <CandyLink href="/login" variant="ghost" size="sm">
                Log In
              </CandyLink>
              <CandyLink href="/signup" variant="primary" size="sm">
                Join
              </CandyLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
