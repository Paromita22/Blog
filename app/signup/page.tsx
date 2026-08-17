"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password }),
    });

    if (res.ok) {
      router.push("/api/auth/signin");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="max-w-sm w-full space-y-4">
        <h1 className="text-3xl font-semibold mb-4">Sign Up</h1>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full px-6 py-2 bg-white text-black rounded-md text-sm uppercase tracking-widest"
        >
          Create Account
        </button>

        <p className="text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link href="/api/auth/signin" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
