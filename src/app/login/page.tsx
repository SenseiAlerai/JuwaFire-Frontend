"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { CandyButton } from "@/components/CandyButton";
import GoogleButton from "@/components/auth/GoogleButton";
import AuthShell, { Field, Divider } from "@/components/auth/AuthShell";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      username: username.trim().toLowerCase(),
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Wrong username or password. Try again.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in and pick up where the rush left off."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-bold text-magenta hover:text-cyan">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton label="Log in with Google" />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4">
        <Field
          label="Username"
          type="text"
          autoComplete="username"
          placeholder="yourname"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p className="rounded-xl bg-red/15 px-3 py-2 text-sm font-semibold text-red">{error}</p>
        )}
        <CandyButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          {loading ? "Logging in…" : "Log In"}
        </CandyButton>
      </form>
    </AuthShell>
  );
}
