"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { CandyLink } from "./CandyButton";
import WalletPill from "./nav/WalletPill";
import NotifBell from "./nav/NotifBell";
import UserMenu from "./nav/UserMenu";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/games", label: "Games" },
  { href: "/store", label: "Buy" },
  { href: "/promotions", label: "Promos" },
  { href: "/vip", label: "VIP" },
  { href: "/cashout", label: "Redeem" },
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
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#05060f]/90 px-3 py-1.5 backdrop-blur-md sm:px-5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-1 py-1 sm:px-2">
        <Link href="/" className="-ml-1 block shrink-0" aria-label="JuwaFire home">
          <Image
            src="/juwafire-logo.png"
            alt="JuwaFire Sweepstakes Games"
            width={1024}
            height={1024}
            className="h-auto w-[72px] drop-shadow-[0_0_18px_rgba(255,46,154,0.35)] sm:w-[80px]"
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
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {user ? (
            <>
              <WalletPill />
              <NotifBell />
              <UserMenu name={displayName} />
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
