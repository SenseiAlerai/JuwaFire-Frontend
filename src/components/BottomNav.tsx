"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Coins, Gamepad2, HandCoins, Menu as MenuIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import MenuSheet from "./MenuSheet";

const ITEMS = [
  { key: "menu", label: "Menu", icon: MenuIcon },
  { key: "buy", href: "/store", label: "Buy", icon: Coins },
  { key: "home", href: "/", label: "Home", icon: Home, center: true },
  { key: "games", href: "/games", label: "Games", icon: Gamepad2 },
  { key: "redeem", href: "/cashout", label: "Redeem", icon: HandCoins },
] as const;

/** Thumb-reachable bottom tab bar — mobile only. */
export default function BottomNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-50 md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-3 mb-3 flex items-end justify-between rounded-[1.75rem] border border-white/12 bg-[rgba(16,9,28,0.92)] px-1.5 py-2 shadow-[0_-8px_40px_-12px_rgba(176,86,255,0.5)] backdrop-blur-xl">
          {ITEMS.map((item) => {
            const active = "href" in item && pathname === item.href;
            const Icon = item.icon;

            if ("center" in item && item.center) {
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className="-mt-7 flex flex-1 flex-col items-center"
                  aria-label={item.label}
                >
                  <span
                    className={cn(
                      "grid h-14 w-14 place-items-center rounded-full bg-[linear-gradient(135deg,#ffc63d,#ff3b5c)] text-white shadow-[0_0_24px_rgba(255,122,47,0.8)] ring-4 ring-[rgba(16,9,28,0.92)] transition-transform active:scale-90",
                      active && "scale-105",
                    )}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="mt-1 text-[11px] font-bold text-ink">{item.label}</span>
                </Link>
              );
            }

            if (item.key === "menu") {
              return (
                <button
                  key={item.key}
                  onClick={() => setMenuOpen(true)}
                  aria-label={item.label}
                  className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-ink-soft transition-colors active:scale-95"
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 transition-colors active:scale-95",
                  active ? "text-magenta" : "text-ink-soft",
                )}
              >
                <Icon className={cn("h-6 w-6", active && "drop-shadow-[0_0_8px_rgba(255,46,154,0.8)]")} />
                <span className="text-[11px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
