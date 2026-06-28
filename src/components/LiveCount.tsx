"use client";

import { useEffect, useState } from "react";

/** A number that gently fluctuates so it reads as a live count. */
export default function LiveCount({ base }: { base: number }) {
  const [n, setN] = useState(base);

  useEffect(() => {
    const id = setInterval(() => {
      setN((cur) => {
        const drift = Math.floor(Math.random() * 25) - 8; // mostly upward
        const next = cur + drift;
        // keep it hovering around base ± ~1.5%
        const lo = Math.floor(base * 0.985);
        const hi = Math.ceil(base * 1.02);
        return Math.min(hi, Math.max(lo, next));
      });
    }, 2600);
    return () => clearInterval(id);
  }, [base]);

  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{n.toLocaleString("en-US")}</span>;
}
