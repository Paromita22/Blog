"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function WriteCTA() {
  const { data: session } = useSession();

  const href = session ? "/dashboard/new" : "/signup";
  const label = session ? "Write a New Post" : "Write Your First Post";

  return (
    <section className="relative px-8 md:px-16 py-24 md:py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
      <motion.div
        className="space-y-6 order-2 md:order-1"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
          Your turn
        </p>

        <h2 className="font-display text-3xl md:text-5xl leading-tight">
          Got something to say?
        </h2>

        <p className="font-body text-base leading-relaxed text-[var(--muted)]">
            
          This started as one person's untidy notebook. It doesn't have to stay
          that way. If you've got a half-formed thought, a rant, a poem you're
          embarrassed by — there's a page here with your name on it.
        </p>

        <Link
          href={href}
          className="inline-block px-6 py-3 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase"
        >
          {label}
        </Link>
      </motion.div>

      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-[var(--line)] order-1 md:order-2"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/images/typewriter.jpg"
          alt="A typewriter, ready for the next page"
          fill
          className="object-cover"
          style={{
            filter:
              "grayscale(0.3) sepia(0.15) contrast(1.05) brightness(0.85)",
          }}
        />
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              "linear-gradient(180deg, transparent 40%, var(--ink) 100%)",
          }}
        />
      </motion.div>
    </section>
  );
}
