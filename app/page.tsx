"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  // This hook grabs the user's session data magically!
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#121212] text-[#e0e0e0] font-serif p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-wide">
          Reluctant Realist's Tales.
        </h1>

        {session ? (
          <div className="space-y-4">
            <p className="text-lg italic text-gray-400">
              Welcome back, {session.user?.name}.
            </p>
            <button
              onClick={() => signOut()}
              className="px-6 py-2 border border-gray-600 hover:bg-gray-800 transition-all rounded-md text-sm tracking-widest uppercase"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-lg italic text-gray-400">
              Like everything else, they'd burn up in this intense hatred I have
              for the world.
            </p>
            <div className="flex gap-4 justify-center mt-8">
              <Link
                href="/api/auth/signin"
                className="px-6 py-2 bg-white text-black hover:bg-gray-200 transition-all rounded-md text-sm tracking-widest uppercase"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
