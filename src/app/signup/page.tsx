"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Gift } from "lucide-react";
import { CandyButton } from "@/components/CandyButton";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthShell, { Field, Divider } from "@/components/auth/AuthShell";

function PrizeBanner() {
  const prize = useSearchParams().get("prize");
  if (!prize) return null;
  return (
    <div className="mb-5 flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffd64d,#ff9a2f)] text-[#1a0e02]">
        <Gift className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-ink">
        You won <span className="font-extrabold text-gold">{prize}</span>! Finish signing up to
        claim it.
      </p>
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create account");
        setLoading(false);
        return;
      }
      // auto-login after successful registration
      await signIn("credentials", {
        username: username.trim().toLowerCase(),
        password,
        redirect: false,
      });
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Join JuwaFire"
      subtitle="Create your account and grab the 100% welcome bonus."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-magenta hover:text-cyan">
            Log in
          </Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <PrizeBanner />
      </Suspense>
      <GoogleButton label="Sign up with Google" />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="pick a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          minLength={3}
          maxLength={20}
          required
        />
        <Field
          label="Email (optional)"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="at least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        {error && (
          <p className="rounded-xl bg-red/15 px-3 py-2 text-sm font-semibold text-red">{error}</p>
        )}
        <CandyButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? "Creating accountâ€¦" : "Create Account"}
        </CandyButton>
        <p className="text-center text-xs text-ink-soft">
          By joining you confirm you&apos;re 18+ and accept the Terms &amp; Responsible Play policy.
        </p>
      </form>
    </AuthShell>
  );
}

