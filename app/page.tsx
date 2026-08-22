"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import NavBar from "./components/NavBar";
import InkBloom from "./components/InkBloom";
import FeaturedBlogs from "./components/FeaturedBlogs";
import Footer from "./components/Footer";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import FloatingPaper from "./components/FloatingPaper";
import PaperBurst from "./components/PaperBurst";
import AuthorNote from "./components/AuthorNote";

const headline = "Reluctant Realist's Tales.";

export default function Home() {
  const { data: session, status } = useSession();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <>
      <NavBar />
      <PaperBurst />
      <main className="relative min-h-screen bg-[var(--ink)] text-[var(--paper)] overflow-hidden">
        {/* Manuscript margin rule — signature element */}
        <div className="fixed left-6 top-0 bottom-0 w-px bg-[var(--line)] hidden md:block">
          <motion.div
            className="absolute top-0 left-0 w-px bg-[var(--ember)]"
            style={{ height: "100%" }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
          />
        </div>

        {/* subtle grain texture */}
        <div
          className="pointer-events-none fixed inset-0 opacity-[0.03] mix-blend-overlay hidden sm:block"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <InkBloom />

        <section
          ref={heroRef}
          className="flex flex-col items-center justify-center min-h-screen px-8 pt-24 text-center"
        >
          <FloatingPaper />
          <motion.div
            className="max-w-3xl space-y-8"
            style={{ y: heroY, opacity: heroOpacity }}
          >
            <motion.p
              className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Notes from a disorganized mind
            </motion.p>

            <h1 className="font-display text-5xl md:text-7xl font-medium tracking-tight leading-[1.05]">
              {headline.split(" ").map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-4"
                  initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 * i,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="font-body italic text-lg md:text-xl text-[var(--muted)] leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              Like everything else, they'd burn up in this intense hatred I have
              for the world.
            </motion.p>

            <motion.div
              className="flex gap-4 justify-center pt-4"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              {status === "loading" ? (
                <span className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">
                  Loading...
                </span>
              ) : session ? (
                <>
                  <span className="font-mono text-sm text-[var(--muted)] self-center">
                    {session.user?.name}
                  </span>
                  <button
                    onClick={() => signOut()}
                    className="px-6 py-2 border border-[var(--line)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-6 py-2 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-6 py-2 border border-[var(--line)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </section>
      </main>
      <AuthorNote />
      <FeaturedBlogs />
      <Footer />
    </>
  );
}
