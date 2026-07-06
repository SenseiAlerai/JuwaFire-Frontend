"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      username: username.trim().toLowerCase(),
      password,
      redirect: false,
    });
    if (res?.error || !res?.ok) {
      setError("Invalid credentials or not an authorized admin.");
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center px-4">
      <form onSubmit={onSubmit} className="card w-full max-w-sm p-7">
        <div className="mb-1 flex items-center gap-2 text-lg font-extrabold">
          <Lock className="h-5 w-5 text-brand" /> JuwaFire Admin
        </div>
        <p className="mb-5 text-sm text-ink-soft">Staff sign in</p>

        <label className="mb-1 block text-xs font-semibold text-ink-soft">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          className="mb-3 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-brand"
        />

        <label className="mb-1 block text-xs font-semibold text-ink-soft">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="mb-4 w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-ink outline-none focus:border-brand"
        />

        {error && <p className="mb-3 text-sm text-bad">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn w-full bg-[linear-gradient(135deg,#ff2e9a,#b056ff)] py-2.5 text-white"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
