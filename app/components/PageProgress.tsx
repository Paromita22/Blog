"use client";

import { motion, useScroll } from "framer-motion";

export default function PageProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed left-6 top-0 bottom-0 w-px bg-[var(--line)] hidden md:block z-40">
      <motion.div
        className="absolute top-0 left-0 w-px bg-[var(--ember)] origin-top"
        style={{ height: "100%", scaleY: scrollYProgress }}
      />
    </div>
  );
}
