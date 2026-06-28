"use client";

import { useEffect, useRef, useState } from "react";

/** A big celebratory jackpot counter that ticks upward forever. */
export default function JackpotTicker({
  start = 1_482_390,
  className,
}: {
  start?: number;
  className?: string;
}) {
  const [value, setValue] = useState(start);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce.current) return;

    const id = setInterval(() => {
      setValue((v) => v + Math.floor(Math.random() * 47) + 3);
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      ${value.toLocaleString("en-US")}
    </span>
  );
}
