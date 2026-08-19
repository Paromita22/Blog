"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const links = (
    <>
      <Link
        href="/blogs"
        onClick={() => setOpen(false)}
        className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
      >
        Writings
      </Link>
      {session ? (
        <>
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/bookmarks"
            onClick={() => setOpen(false)}
            className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
          >
            Bookmarks
          </Link>
          <button
            onClick={() => {
              setOpen(false);
              signOut({ callbackUrl: "/" });
            }}
            className="text-[var(--muted)] hover:text-[var(--ember)] transition-colors text-left"
          >
            Sign Out
          </button>
        </>
      ) : (
        <Link
          href="/signin"
          onClick={() => setOpen(false)}
          className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
        >
          Sign In
        </Link>
      )}
      <ThemeToggle />
    </>
  );

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 md:px-16 py-6 font-mono text-xs tracking-widest uppercase"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-[var(--paper)] hover:text-[var(--ember)] transition-colors"
        >
          PCJ Blogs
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 items-center">{links}</div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-[var(--paper)]"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-[var(--ink)] border-t border-[var(--line)] mt-6"
          >
            <div className="flex flex-col gap-6 py-6">{links}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
