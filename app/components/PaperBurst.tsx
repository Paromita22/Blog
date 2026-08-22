"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const paperShapes = [
  "polygon(20% 0%, 80% 5%, 100% 60%, 70% 100%, 10% 90%, 0% 40%)",
  "polygon(10% 10%, 90% 0%, 100% 70%, 60% 100%, 20% 95%, 0% 50%)",
  "polygon(0% 20%, 60% 0%, 100% 30%, 90% 90%, 30% 100%, 0% 70%)",
  "polygon(15% 0%, 100% 15%, 85% 100%, 30% 90%, 0% 55%, 5% 20%)",
  "polygon(0% 0%, 100% 10%, 90% 100%, 10% 90%, 5% 50%, 30% 20%)",
];

const DURATION = 9; // <-- tweak this one number to change overall speed

type Piece = {
  startX: number;
  startY: number;
  crossX: number;
  crossY: number;
  splitX: number;
  splitY: number;
  size: number;
  paperShape: string;
  delay: number;
  survives: boolean;
};

export default function PaperBurst() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [phase, setPhase] = useState<"idle" | "playing" | "settled">("idle");

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      setPhase("settled");
      return;
    }

    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const pieceCount = isMobile ? 8 : 18;

    const generated: Piece[] = Array.from({ length: pieceCount }).map(
      (_, i) => {
        const fromLeft = i % 2 === 0;
        return {
          startX: fromLeft
            ? -700 - Math.random() * 200
            : 700 + Math.random() * 200,
          startY: Math.random() * 500 - 100,
          crossX: (Math.random() - 0.5) * 250,
          crossY: Math.random() * 300 - 100,
          splitX: fromLeft
            ? -800 - Math.random() * 200
            : 800 + Math.random() * 200,
          splitY: Math.random() * 300 - 150,
          size: 40 + Math.random() * 60,
          paperShape: paperShapes[i % paperShapes.length],
          delay: Math.random() * 0.6,
          survives: i === 3 || i === 11,
        };
      },
    );
    setPieces(generated);
    setPhase("playing");

    const timer = setTimeout(() => setPhase("settled"), (9 + 1) * 1000);
    return () => clearTimeout(timer);
  }, []);

  if (phase === "idle" || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ width: p.size, height: p.size }}
          initial={{ x: p.startX, y: p.startY, opacity: 0, scale: 0.7 }}
          animate={
            phase === "playing"
              ? {
                  x: [p.startX, p.crossX, p.crossX, p.splitX],
                  y: [p.startY, p.crossY, p.crossY, p.splitY],
                  opacity: [0, 1, 1, 0],
                  scale: [0.7, 1, 1, 1],
                }
              : p.survives
                ? { x: p.crossX, y: p.crossY, opacity: 0.12, scale: 1 }
                : { opacity: 0 }
          }
          transition={
            phase === "playing"
              ? {
                  duration: DURATION,
                  delay: p.delay,
                  times: [0, 0.35, 0.55, 1],
                  ease: [0.45, 0, 0.2, 1],
                }
              : { duration: 1.5 }
          }
        >
          <motion.div
            className="absolute inset-0 bg-[var(--paper)]"
            style={{ clipPath: p.paperShape }}
            animate={
              phase === "playing"
                ? { opacity: [1, 1, 0, 0] }
                : { opacity: p.survives ? 1 : 0 }
            }
            transition={
              phase === "playing"
                ? {
                    duration: DURATION,
                    delay: p.delay,
                    times: [0, 0.35, 0.5, 1],
                  }
                : { duration: 1.5 }
            }
          />
          <motion.svg
            viewBox="0 0 100 40"
            className="absolute inset-0 w-full h-full"
            style={{ top: "30%" }}
            animate={
              phase === "playing" ? { opacity: [0, 0, 1, 1] } : { opacity: 0 }
            }
            transition={
              phase === "playing"
                ? {
                    duration: DURATION,
                    delay: p.delay,
                    times: [0, 0.45, 0.6, 1],
                  }
                : { duration: 1.5 }
            }
          >
            <path
              d="M0,30 C15,10 25,25 35,15 C40,10 45,10 50,20 C55,10 60,10 65,15 C75,25 85,10 100,30 C80,20 65,28 50,18 C35,28 20,20 0,30 Z"
              fill="var(--paper)"
            />
          </motion.svg>
        </motion.div>
      ))}
    </div>
  );
}
