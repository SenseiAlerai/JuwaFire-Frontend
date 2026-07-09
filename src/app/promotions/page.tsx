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
    mascot: "/promos/promo-bonus.png",
    from: "#ff2e9a",
    to: "#ff3b5c",
  },
  {
    title: "INVITE & EARN!",
    text: "Get $10 for every friend who deposits $10 or more. Unlimited referrals, unlimited earnings.",
    cta: "Invite Now",
    href: "/refer",
    mascot: "/promos/promo-invite.png",
    from: "#12b8c8",
    to: "#3b82f6",
  },
  {
    title: "UNLOCK HIGHER PAYOUTS!",
    text: "VIP members climb the ranks for bigger withdrawal limits and exclusive rewards.",
    cta: "More Info",
    href: "/vip",
    mascot: "/promos/promo-vip.png",
    from: "#ff7a2f",
    to: "#b056ff",
  },
  {
    title: "SPIN THE WHEEL!",
    text: "Unlock surprise bonuses, free credits, and exclusive rewards every spin.",
    cta: "Spin Now",
    href: "/",
    mascot: "/promos/promo-wheel.png",
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
                className="relative overflow-hidden rounded-3xl shadow-[0_18px_46px_-20px_rgba(0,0,0,0.9)]"
                style={{ background: `linear-gradient(115deg, ${b.from}, ${b.to})` }}
              >
                <div className="pointer-events-none absolute -left-6 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />

                {/* flow layout: mascot stretches to card height, text grows the card */}
                <div className="relative flex items-stretch gap-3 p-4 sm:gap-4 sm:p-5">
                  <div className="relative min-h-[140px] w-[38%] shrink-0 self-stretch sm:min-h-[160px]">
                    <Image
                      src={b.mascot}
                      alt=""
                      fill
                      quality={95}
                      sizes="(max-width:640px) 40vw, 300px"
                      className="object-contain object-bottom"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center py-1 text-right">
                    <h2 className="font-display text-lg font-extrabold uppercase leading-tight text-white drop-shadow sm:text-2xl">
                      {b.title}
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-white/90 sm:text-sm">{b.text}</p>
                    <Link
                      href={b.href}
                      className="mt-3 ml-auto inline-flex w-fit items-center rounded-xl bg-[linear-gradient(135deg,#ffd64d,#ff7a2f)] px-4 py-2 font-display text-sm font-extrabold text-[#1a0e02] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.7)] transition-transform active:scale-95 sm:px-5 sm:py-2.5 sm:text-base"
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
