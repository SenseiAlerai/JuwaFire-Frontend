/** Hexagonal VIP rank medal (pure SVG, colored per rank). */
export default function RankBadge({
  color,
  stars,
  size = 72,
  glow = false,
}: {
  color: string;
  stars: number;
  size?: number;
  glow?: boolean;
}) {
  const id = `rb-${color.replace("#", "")}`;
  const hex = "50,4 90,27 90,73 50,96 10,73 10,27";
  const starRow = Array.from({ length: stars });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={glow ? { filter: `drop-shadow(0 0 10px ${color})` } : undefined}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#0b0b12" />
        </linearGradient>
      </defs>
      <polygon points={hex} fill={`url(#${id})`} stroke={color} strokeWidth="4" strokeLinejoin="round" />
      <polygon points="50,14 82,31 82,69 50,86 18,69 18,31" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
      <g transform="translate(50,50)" fill="#fff" stroke="rgba(0,0,0,0.35)" strokeWidth="0.5">
        {starRow.map((_, i) => {
          const spread = 14;
          const x = (i - (stars - 1) / 2) * spread;
          return (
            <text key={i} x={x} y={5} fontSize="18" fontWeight="900" textAnchor="middle" style={{ fontFamily: "sans-serif" }}>
              ★
            </text>
          );
        })}
      </g>
    </svg>
  );
}
