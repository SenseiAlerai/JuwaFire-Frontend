import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="px-4 py-12">
      <div className="candy-card mx-auto w-full max-w-md rounded-[2rem] p-8 sm:p-10">
        <Link href="/" className="mx-auto block w-fit">
          <Image
            src="/juwafire-logo.png"
            alt="JuwaFire Sweepstakes Games"
            width={1024}
            height={1024}
            className="h-auto w-[230px] drop-shadow-[0_0_24px_rgba(255,46,154,0.32)] sm:w-[260px]"
            priority
          />
        </Link>

        <h1 className="mt-6 text-center font-display text-3xl font-extrabold text-ink">{title}</h1>
        <p className="mt-1 text-center text-ink-soft">{subtitle}</p>

        <div className="mt-7">{children}</div>

        <p className="mt-6 text-center text-sm text-ink-soft">{footer}</p>
      </div>
    </div>
  );
}

export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-display text-sm font-semibold text-ink">{label}</span>
      <input
        {...props}
        className="neon-chip w-full rounded-xl px-4 py-3 font-medium text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-magenta"
      />
    </label>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-wide text-ink-soft">
      <span className="h-px flex-1 bg-white/15" />
      or
      <span className="h-px flex-1 bg-white/15" />
    </div>
  );
}
