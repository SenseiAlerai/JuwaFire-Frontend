"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gold" | "win" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANTS: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(120deg,#ff2e9a,#b056ff)] shadow-[0_8px_30px_-6px_rgba(255,46,154,0.7)] hover:shadow-[0_10px_38px_-4px_rgba(255,46,154,0.9)]",
  gold:
    "text-[#1a0e02] bg-[linear-gradient(120deg,#ffd64d,#ff9a2f)] shadow-[0_8px_30px_-6px_rgba(255,182,61,0.7)] hover:shadow-[0_10px_38px_-4px_rgba(255,182,61,0.95)]",
  win:
    "text-[#0a1402] bg-[linear-gradient(120deg,#aaff3c,#2de2ff)] shadow-[0_8px_30px_-6px_rgba(170,255,60,0.6)] hover:shadow-[0_10px_38px_-4px_rgba(170,255,60,0.85)]",
  ghost:
    "text-ink bg-white/5 border border-white/20 backdrop-blur-md hover:bg-white/10 hover:border-white/35",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold cursor-pointer select-none " +
  "transition-all duration-200 active:scale-95 focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-cyan/70 focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
  "hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

export function CandyButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, VARIANTS[variant], SIZES[size], className)} {...props}>
      {children}
    </button>
  );
}

export function CandyLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, VARIANTS[variant], SIZES[size], className)}>
      {children}
    </Link>
  );
}
