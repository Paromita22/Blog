"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function NavBar() {
  const { data: session } = useSession();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-16 py-6 font-mono text-xs tracking-widest uppercase"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link
        href="/"
        className="text-[var(--paper)] hover:text-[var(--ember)] transition-colors"
      >
        PCJ Blogs
      </Link>
      <div className="flex gap-8 items-center">
        <Link
          href="/blogs"
          className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
        >
          Writings
        </Link>
        {session ? (
          <>
            <Link
              href="/dashboard"
              className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={() => signOut()}
              className="text-[var(--muted)] hover:text-[var(--ember)] transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/signin"
            className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
