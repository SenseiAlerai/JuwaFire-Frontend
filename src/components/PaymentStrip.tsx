import Image from "next/image";

const PAYMENTS = [
  { name: "Cash App", image: "/payments/pay-cashapp.png" },
  { name: "Zelle", image: "/payments/pay-zelle.png" },
  { name: "Apple Pay", image: "/payments/pay-applepay.png" },
  { name: "Google Pay", image: "/payments/pay-gpay.png" },
  { name: "Chime", image: "/payments/pay-chime.png" },
  { name: "Debit & Credit", image: "/payments/pay-card.png" },
];

/** Marquee of the saved payment logos as tiles. */
export default function PaymentStrip() {
  const row = [...PAYMENTS, ...PAYMENTS, ...PAYMENTS];

  return (
    <div className="relative mt-5 overflow-hidden py-1 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-3 [animation-direction:reverse] [animation-duration:26s] motion-reduce:animate-none">
        {row.map((p, i) => (
          <div
            key={`${p.name}-${i}`}
            className="relative h-16 w-40 shrink-0 sm:h-[72px] sm:w-44"
          >
            <Image
              src={p.image}
              alt={`${p.name} payments`}
              fill
              sizes="180px"
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
