"use client";

import { useEffect, useState } from "react";
import FadeIn from "./FadeIn";

export default function StatsStrip() {
  const [stats, setStats] = useState<{
    postCount: number;
    userCount: number;
    wordCount: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  if (!stats) return null;

  const display = [
    { label: "Posts Published", value: stats.postCount },
    { label: "Words Written", value: stats.wordCount.toLocaleString() },
    { label: "Registered Users", value: stats.userCount },
  ];

  return (
    <section className="border-y border-[var(--line)] px-8 md:px-16 py-12">
      <FadeIn className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        {display.map((s) => (
          <div key={s.label} className="space-y-2">
            <p className="font-display text-4xl md:text-5xl text-[var(--ember)]">
              {s.value}
            </p>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
              {s.label}
            </p>
          </div>
        ))}
      </FadeIn>
    </section>
  );
}
