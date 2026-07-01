import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { formatUSD } from "@/lib/wallet";
import ProfileActions from "@/components/profile/ProfileActions";
import { CandyLink } from "@/components/CandyButton";
import { Wallet, Gift, Crown, Gamepad2, Headphones } from "lucide-react";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/dashboard", label: "Wallet & Activity", icon: Wallet },
  { href: "/promotions", label: "Bonuses & Drops", icon: Gift },
  { href: "/vip", label: "VIP Tiers", icon: Crown },
  { href: "/games", label: "Browse Games", icon: Gamepad2 },
];

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
  if (!me) redirect("/login");

  const displayName = me.username || me.name || "player";
  const initial = displayName.charAt(0).toUpperCase();
  const joined = new Date(me.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="px-4 pt-10 pb-8">
      <div className="mx-auto max-w-2xl">
        {/* Identity card */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#2a0a3f,#3a0a2e)] p-8 text-center shadow-[0_30px_70px_-30px_rgba(255,46,154,0.6)]">
          <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_15%_15%,rgba(255,46,154,0.5)_0,transparent_45%),radial-gradient(circle_at_85%_85%,rgba(45,226,255,0.45)_0,transparent_40%)]" />
          <div className="relative">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] font-display text-3xl font-extrabold text-white shadow-[0_0_30px_rgba(255,46,154,0.7)]">
              {initial}
            </span>
            <h1 className="mt-4 font-display text-3xl font-extrabold capitalize text-ink">
              {displayName}
            </h1>
            {me.email && <p className="mt-1 text-sm text-ink-soft">{me.email}</p>}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
              <span className="neon-chip rounded-full px-3 py-1 text-white">
                Member since {joined}
              </span>
              <span className="neon-chip rounded-full px-3 py-1 text-white">
                {formatUSD(me.balanceCents)} balance
              </span>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {LINKS.map((l) => {
            const Icon = l.icon;
            return (
              <a
                key={l.href}
                href={l.href}
                className="candy-card group flex items-center gap-3 rounded-2xl p-4 transition-transform hover:-translate-y-1"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 text-ink transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="font-display font-bold text-ink">{l.label}</span>
              </a>
            );
          })}
        </div>

        {/* Support */}
        <a
          href="https://wa.me/10000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="candy-card mt-3 flex items-center gap-3 rounded-2xl p-4"
        >
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/8 text-ink">
            <Headphones className="h-5 w-5" />
          </span>
          <span className="font-display font-bold text-ink">24/7 Support</span>
        </a>

        {/* Account actions */}
        <ProfileActions />
      </div>
    </div>
  );
}
