"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AuthorNote() {
  return (
    <section className="relative px-8 md:px-16 py-24 md:py-32 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
      <motion.div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-[var(--line)]"
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/images/shoreline.jpg"
          alt="Two figures watching birds over the water"
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

      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
          A Note From the Creator
        </p>

        <p className="font-body italic text-xl md:text-2xl leading-relaxed text-[var(--paper)]">
          "Sticking around to see how this mess unfolds, and if I can beat the world in the race to ruin everything"
        </p>

        <p className="font-body text-base leading-relaxed text-[var(--muted)] lg:text-justify">
          The idea originated from the desire for belonging. If not the writer, perhaps the writings should have a place of their own. I am here just to seek a retreat from the crowded feeds and endless scroll to a personal quieter corner. You are welcome to join me here to share some of your bright ideas or mundane melancholy.
        </p>

        <p className="font-mono text-xs tracking-widest text-[var(--muted)] pt-2">
          — Founder, PCJ Blogs
        </p>
      </motion.div>
    </section>
  );
}
