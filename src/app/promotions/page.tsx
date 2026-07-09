import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Promotions — JuwaFire",
  description: "Deposit bonuses, refer & earn, VIP payout boosts, and the daily prize wheel.",
};

const BANNERS = [
  {
    title: "20% WELCOME BONUS!",
    text: "Get an extra 20% credited on your first deposit — automatically.",
    cta: "Claim Now",
    href: "/store",
    mascot: "/mascot/mascot-blaze-dragon.png",
    from: "#ff2e9a",
    to: "#ff3b5c",
  },
  {
    title: "INVITE & EARN!",
    text: "Get $10 for every friend who deposits $10 or more. Unlimited referrals, unlimited earnings.",
    cta: "Invite Now",
    href: "/refer",
    mascot: "/mascot/mascot-blaze-dragons-duo.png",
    from: "#12b8c8",
    to: "#3b82f6",
  },
  {
    title: "UNLOCK HIGHER PAYOUTS!",
    text: "VIP members climb the ranks for bigger withdrawal limits and exclusive rewards.",
    cta: "More Info",
    href: "/vip",
    mascot: "/mascot/mascot-blaze-goofy.png",
    from: "#ff7a2f",
    to: "#b056ff",
  },
  {
    title: "SPIN THE WHEEL!",
    text: "Unlock surprise bonuses, free credits, and exclusive rewards every spin.",
    cta: "Spin Now",
    href: "/",
    mascot: "/mascot/mascot-blaze-goofy.png",
    from: "#ffc63d",
    to: "#ff3b5c",
  },
];

export default function PromotionsPage() {
  return (
    <div className="px-4 pt-8 pb-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          <Megaphone className="h-7 w-7 text-magenta" /> Promotions
        </h1>

        <div className="mt-6 space-y-5">
          {BANNERS.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div
                className="relative overflow-hidden rounded-3xl p-5 shadow-[0_18px_46px_-20px_rgba(0,0,0,0.9)] sm:p-6"
                style={{ background: `linear-gradient(115deg, ${b.from}, ${b.to})` }}
              >
                <div className="pointer-events-none absolute -left-6 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
                <div className="relative flex items-center gap-3">
                  <span className="relative h-24 w-24 shrink-0 drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)] sm:h-28 sm:w-28">
                    <Image src={b.mascot} alt="" fill sizes="112px" className="object-contain" />
                  </span>
                  <div className="min-w-0 flex-1 text-right">
                    <h2 className="font-display text-xl font-extrabold uppercase leading-tight text-white drop-shadow sm:text-2xl">
                      {b.title}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-white/90">{b.text}</p>
                    <Link
                      href={b.href}
                      className="mt-3 inline-flex items-center rounded-xl bg-[linear-gradient(135deg,#ffd64d,#ff7a2f)] px-5 py-2.5 font-display font-extrabold text-[#1a0e02] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] transition-transform active:scale-95"
                    >
                      {b.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
