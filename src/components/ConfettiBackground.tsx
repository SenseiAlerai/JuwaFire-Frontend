"use client";

import { useMemo } from "react";

const COLORS = ["#ff2e9a", "#b056ff", "#2de2ff", "#ffc63d", "#aaff3c"];

// Deterministic pseudo-random so server & client markup match (no hydration drift).
function seeded(i: number) {
  const x = Math.sin(i * 99.123) * 10000;
  return x - Math.floor(x);
}

/** Drifting aurora glow + rising neon sparks fixed behind all content. */
export default function ConfettiBackground({ count = 30 }: { count?: number }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const left = seeded(i) * 100;
        const delay = seeded(i + 7) * -18;
        const duration = 11 + seeded(i + 3) * 12;
        const size = 3 + seeded(i + 5) * 6;
        const color = COLORS[i % COLORS.length];
        return { left, delay, duration, size, color, i };
      }),
    [count],
  );

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* TEST: aurora blobs removed for clean-black look (restore two blur-3xl radial divs to revert) */}

      {/* rising neon sparks */}
      <div className="absolute inset-0 motion-reduce:hidden">
        {sparks.map((s) => (
          <span
            key={s.i}
            className="absolute bottom-0 block rounded-full"
            style={{
              left: `${s.left}%`,
              width: s.size,
              height: s.size,
              background: s.color,
              boxShadow: `0 0 ${s.size * 2.5}px ${s.color}`,
              animation: `rise ${s.duration}s linear ${s.delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
