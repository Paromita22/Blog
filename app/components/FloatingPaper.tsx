"use client";

import { motion } from "framer-motion";

const scraps = [
  { top: "15%", left: "8%", rotate: -12, delay: 0.2, size: 90 },
  { top: "65%", left: "12%", rotate: 8, delay: 0.5, size: 70 },
  { top: "22%", left: "85%", rotate: 15, delay: 0.35, size: 100 },
  { top: "72%", left: "88%", rotate: -6, delay: 0.65, size: 60 },
  { top: "45%", left: "5%", rotate: 20, delay: 0.8, size: 50 },
  { top: "5%", left: "3%", rotate: 30, delay: 0.4, size: 65 },
  { top: "88%", left: "6%", rotate: -18, delay: 0.55, size: 75 },
  { top: "8%", left: "92%", rotate: -25, delay: 0.7, size: 55 },
  { top: "58%", left: "94%", rotate: 10, delay: 0.9, size: 85 },
];

export default function FloatingPaper() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {scraps.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size * 1.3,
          }}
          initial={{ y: -300, opacity: 0, rotate: s.rotate - 40 }}
          animate={{
            y: [0, -10, 0],
            opacity: 0.12,
            rotate: [s.rotate, s.rotate + 3, s.rotate],
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay + 1,
            },
            rotate: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay + 1,
            },
            opacity: { duration: 1, delay: s.delay },
            default: { duration: 1.2, delay: s.delay, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <div className="w-full h-full bg-[var(--paper)] opacity-90" />

          {/* style={{ background:
                "linear-gradient(135deg, transparent 40%, var(--paper) 41%, transparent 42%)",
            }}
          />*/}
        </motion.div>
      ))}
    </div>
  );
}
