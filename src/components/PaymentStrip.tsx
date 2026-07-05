import { CreditCard } from "lucide-react";

/* Brand-colored wordmarks — transparent, crisp on the dark strip. */
const PAYMENTS: { name: string; color: string; card?: boolean }[] = [
  { name: "Cash App", color: "#00D632" },
  { name: "Zelle", color: "#a06bff" },
  { name: "Apple Pay", color: "#f5f5f7" },
  { name: "Google Pay", color: "#e8eaed" },
  { name: "Chime", color: "#1EC677" },
  { name: "Debit & Credit", color: "#dfe7ff", card: true },
];

export default function PaymentStrip() {
  const row = [...PAYMENTS, ...PAYMENTS, ...PAYMENTS];

  return (
    <div className="relative mt-5 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-3 [animation-direction:reverse] [animation-duration:26s] motion-reduce:animate-none">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex h-12 shrink-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 backdrop-blur-sm"
          >
            {p.card ? (
              <CreditCard className="h-5 w-5" style={{ color: p.color }} />
            ) : (
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ background: p.color, boxShadow: `0 0 10px ${p.color}` }}
              />
            )}
            <span
              className="whitespace-nowrap font-display text-base font-extrabold tracking-tight"
              style={{ color: p.color }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
