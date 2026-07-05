import Image from "next/image";

/* All logos share the same intrinsic height (144px) → equal display height. */
const PAYMENTS = [
  { name: "Cash App", image: "/payments/pay-cashapp.png", w: 562 },
  { name: "Zelle", image: "/payments/pay-zelle.png", w: 339 },
  { name: "Apple Pay", image: "/payments/pay-applepay.png", w: 357 },
  { name: "Google Pay", image: "/payments/pay-gpay.png", w: 145 },
  { name: "Chime", image: "/payments/pay-chime.png", w: 528 },
  { name: "Debit & Credit", image: "/payments/pay-card.png", w: 222 },
];

export default function PaymentStrip() {
  const row = [...PAYMENTS, ...PAYMENTS, ...PAYMENTS];

  return (
    <div className="relative mt-5 overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee items-center gap-10 [animation-direction:reverse] [animation-duration:28s] motion-reduce:animate-none sm:gap-14">
        {row.map((p, i) => (
          <Image
            key={`${p.name}-${i}`}
            src={p.image}
            alt={`${p.name} payments`}
            width={p.w}
            height={144}
            sizes="220px"
            className="h-7 w-auto shrink-0 object-contain sm:h-9"
          />
        ))}
      </div>
    </div>
  );
}
