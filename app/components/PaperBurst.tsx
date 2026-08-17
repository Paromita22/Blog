"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const clipShapes = [
  "polygon(20% 0%, 80% 5%, 100% 60%, 70% 100%, 10% 90%, 0% 40%)",
  "polygon(10% 10%, 90% 0%, 100% 70%, 60% 100%, 20% 95%, 0% 50%)",
  "polygon(0% 20%, 60% 0%, 100% 30%, 90% 90%, 30% 100%, 0% 70%)",
  "polygon(15% 0%, 100% 15%, 85% 100%, 30% 90%, 0% 55%)",
  "polygon(0% 0%, 100% 10%, 90% 100%, 10% 90%)",
];

type Piece = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotate: number;
  size: number;
  clip: string;
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
    if (reduced) return;

    const centerSpread = () => (Math.random() - 0.5) * 300;

    const generated: Piece[] = Array.from({ length: 18 }).map((_, i) => {
      const fromLeft = i % 2 === 0;
      return {
        startX: fromLeft
          ? -700 - Math.random() * 200
          : 700 + Math.random() * 200,
        startY: Math.random() * 500 - 100,
        endX: centerSpread(),
        endY: Math.random() * 400 - 100,
        rotate: (Math.random() - 0.5) * 540,
        size: 40 + Math.random() * 60,
        clip: clipShapes[i % clipShapes.length],
        delay: Math.random() * 0.3,
        survives: i === 3 || i === 11, // exactly 2 pieces stay
      };
    });
    setPieces(generated);
    setPhase("playing");

    const timer = setTimeout(() => setPhase("settled"), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (phase === "idle" || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center overflow-hidden">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute bg-[var(--paper)]"
          style={{ width: p.size, height: p.size * 1.2, clipPath: p.clip }}
          initial={{
            x: p.startX,
            y: p.startY,
            opacity: 0,
            rotate: 0,
            scale: 0.6,
          }}
          animate={
            phase === "playing"
              ? {
                  x: p.endX,
                  y: p.endY,
                  opacity: [0, 1, 1],
                  rotate: p.rotate,
                  scale: 1,
                }
              : p.survives
                ? {
                    x: p.endX,
                    y: p.endY,
                    opacity: 0.1,
                    rotate: p.rotate,
                    scale: 1,
                  }
                : {
                    x: p.endX,
                    y: p.endY,
                    opacity: 0,
                    rotate: p.rotate,
                    scale: 1,
                  }
          }
          transition={{
            duration: phase === "playing" ? 3.2 : 0.5,
            delay: phase === "playing" ? p.delay : 0,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}
