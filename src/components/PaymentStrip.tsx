import Image from "next/image";

const PAYMENTS = [
  { name: "Cash App", image: "/payments/cash-app.png" },
  { name: "Zelle", image: "/payments/zelle.png" },
  { name: "Apple Pay", image: "/payments/apple-pay.png" },
  { name: "Google Pay", image: "/payments/google-pay.png" },
  { name: "PayPal", image: "/payments/paypal.png" },
  { name: "Chime", image: "/payments/chime-word.png" },
  { name: "Venmo", image: "/payments/venmo-word.png" },
  { name: "Revolut", image: "/payments/revolut.png" },
  { name: "Bitcoin", image: "/payments/bitcoin-logo.png" },
  { name: "Skrill", image: "/payments/skrill.png" },
  { name: "Debit card", image: "/payments/debit-card.png" },
];

/** Compact marquee of payment logos in small glass chips. */
export default function PaymentStrip() {
  const row = [...PAYMENTS, ...PAYMENTS, ...PAYMENTS];

  return (
    <div className="relative mt-5 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-3 [animation-direction:reverse] [animation-duration:26s] motion-reduce:animate-none">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="flex h-12 w-32 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 backdrop-blur-sm sm:h-14 sm:w-36"
          >
            <Image
              src={p.image}
              alt={`${p.name} payments`}
              width={768}
              height={512}
              className="h-full max-h-8 w-auto max-w-full object-contain sm:max-h-9"
              sizes="140px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
