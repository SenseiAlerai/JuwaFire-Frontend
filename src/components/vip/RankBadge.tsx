import Image from "next/image";

/** VIP rank medal — real winged-hexagon art per rank (public/vip/rank-*.png). */
export default function RankBadge({
  name,
  color,
  size = 72,
  glow = false,
}: {
  name: string;
  color?: string;
  size?: number;
  glow?: boolean;
}) {
  const w = Math.round(size * 1.2);
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: w, height: size, filter: glow && color ? `drop-shadow(0 0 9px ${color})` : undefined }}
    >
      <Image
        src={`/vip/rank-${name.toLowerCase()}.png`}
        alt={`${name} rank`}
        fill
        sizes={`${w}px`}
        className="object-contain"
      />
    </span>
  );
}
