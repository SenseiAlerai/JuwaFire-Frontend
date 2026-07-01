import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

const COLS = [
  {
    title: "Play",
    links: [
      { label: "All Games", href: "/games" },
      { label: "Slots", href: "/games" },
      { label: "Fish Games", href: "/games" },
      { label: "Jackpots", href: "/games" },
    ],
  },
  {
    title: "Rewards",
    links: [
      { label: "Promotions", href: "/promotions" },
      { label: "VIP Club", href: "/vip" },
      { label: "Daily Wheel", href: "/promotions" },
      { label: "Refer a Friend", href: "/promotions" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Support", href: "/profile" },
      { label: "Payments", href: "/promotions" },
      { label: "Responsible Play", href: "/promotions" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
];

const COMPLIANCE = ["18+ Only", "No Purchase Necessary", "Play Responsibly", "Void Where Prohibited"];

function IgIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 00-1.38-2.13A5.9 5.9 0 0019.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1018.16 12 6.16 6.16 0 0012 5.84zm0 10.16A4 4 0 1116 12a4 4 0 01-4 4zm6.4-11.85a1.44 1.44 0 11-1.44-1.44 1.44 1.44 0 011.44 1.44z" />
    </svg>
  );
}
function FbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}
function TgIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const SOCIALS = [
  { name: "Instagram", href: "https://instagram.com/juwafire", Icon: IgIcon },
  { name: "Facebook", href: "https://facebook.com/juwafire", Icon: FbIcon },
  { name: "Telegram", href: "https://t.me/juwafire", Icon: TgIcon },
  { name: "X", href: "https://x.com/juwafire", Icon: XIcon },
];

export default function Footer() {
  return (
    <footer className="mt-24 px-3 pb-28 sm:px-5 md:pb-8">
      <div className="candy-card mx-auto max-w-7xl rounded-[2rem] p-8 sm:p-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Image
              src="/juwafire-logo.png"
              alt="JuwaFire Sweepstakes Games"
              width={1024}
              height={1024}
              className="h-auto w-[108px] drop-shadow-[0_0_16px_rgba(255,46,154,0.28)]"
            />
            <p className="mt-4 max-w-xs text-ink-soft">
              The brightest lights on the strip. Electric games, real jackpots and a rush
              that never sleeps. Step into the glow.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/6 text-ink-soft transition-colors hover:bg-white/12 hover:text-magenta"
                >
                  <s.Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display font-bold text-ink">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-ink-soft transition-colors hover:text-magenta"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* compliance band */}
        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-wrap gap-2">
            {COMPLIANCE.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink-soft"
              >
                {c}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-ink-soft/80">
            JuwaFire is a social sweepstakes platform. No purchase is necessary to enter or win.
            A purchase will not increase your chances of winning. Sweepstakes are void where
            prohibited by law. You must be 18 years or older to participate. Please play
            responsibly — if gambling stops being fun, call 1-800-522-4700.
          </p>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} JuwaFire. Play for fun, win for real. 18+</p>
          <p className="flex items-center gap-2 rounded-full bg-lime/10 px-3 py-1 font-display font-semibold text-lime">
            <ShieldCheck className="h-4 w-4" /> Secure &amp; Fair Play
          </p>
        </div>
      </div>
    </footer>
  );
}
