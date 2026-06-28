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
  { name: "PayPal logo", image: "/payments/paypal-word.png" },
  { name: "Skrill", image: "/payments/skrill.png" },
  { name: "Debit card", image: "/payments/debit-card.png" },
];

export default function PaymentStrip() {
  const row = [...PAYMENTS, ...PAYMENTS, ...PAYMENTS];

  return (
    <div className="relative mt-4 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-5 [animation-direction:reverse] [animation-duration:18s] motion-reduce:animate-none">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="relative flex h-32 w-64 shrink-0 items-center justify-center sm:h-40 sm:w-80"
          >
            <Image
              src={p.image}
              alt={`${p.name} payments`}
              width={768}
              height={512}
              className="relative h-full w-full object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.5)]"
              sizes="(max-width: 640px) 240px, 320px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}



