"use client";

import { motion } from "framer-motion";

export default function InkBloom() {
  return (
    <svg
      viewBox="0 0 800 800"
      className="ink-bloom-svg absolute inset-0 w-full h-full opacity-[0.35] pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
    >
      <motion.circle
        cx="400"
        cy="300"
        r="180"
        fill="var(--ember)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.1, 1], opacity: [0, 0.6, 0.4] }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
        style={{ filter: "blur(60px)" }}
      />
      <motion.circle
        cx="550"
        cy="500"
        r="120"
        fill="var(--paper)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.15, 0.08] }}
        transition={{ duration: 4, ease: "easeOut", delay: 1 }}
        style={{ filter: "blur(80px)" }}
      />
      <motion.circle
        cx="250"
        cy="550"
        r="90"
        fill="var(--ember-dim)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1, 1.05, 1], opacity: [0, 0.5, 0.3] }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          delay: 1.5,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{ filter: "blur(50px)" }}
      />
    </svg>
  );
}
