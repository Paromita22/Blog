"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password, website }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/signin");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
  }

  return (
    <PageShell>
      <div className="max-w-sm mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
              Join the notes
            </p>
            <h1 className="font-display text-3xl">Sign Up</h1>
          </div>

          {error && (
            <p className="text-sm text-[var(--ember)] font-mono text-center">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 border border-[var(--line)] hover:border-[var(--paper)] transition-colors rounded-sm py-3 font-mono text-xs tracking-widest uppercase"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.5 5.1 29.5 3 24 3c-7.7 0-14.3 4.4-17.7 10.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 45c5.3 0 10.1-2 13.7-5.3l-6.3-5.3C29.4 36 26.8 37 24 37c-5.2 0-9.6-3.3-11.3-8l-6.6 5.1C9.6 40.5 16.3 45 24 45z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.3 5.3C40.9 36.6 43 30.9 43 24c0-1.4-.1-2.7-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4">
            <div className="h-px bg-[var(--line)] flex-1" />
            <span className="font-mono text-xs text-[var(--muted)]">OR</span>
            <div className="h-px bg-[var(--line)] flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 text-sm transition-colors"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 text-sm transition-colors"
            />
            {/* Honeypot field - hidden from users, visible to bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              style={{ display: "none" }}
              aria-hidden="true"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 pr-12 text-sm transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm py-3 font-mono text-xs tracking-widest uppercase disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center font-mono text-xs text-[var(--muted)]">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="underline hover:text-[var(--paper)] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </PageShell>
  );
}
