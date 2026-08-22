"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import FadeIn from "./FadeIn";

type Category = { category: string; _count: { category: number } };

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="px-8 md:px-16 py-24 md:py-32 max-w-5xl mx-auto">
      <FadeIn className="space-y-2 mb-12">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
          Browse by Mood
        </p>
        <h2 className="font-display text-3xl md:text-4xl">Categories</h2>
      </FadeIn>

      <FadeIn className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <Link
            key={c.category}
            href={`/blogs?category=${encodeURIComponent(c.category)}`}
            className="group border border-[var(--line)] hover:border-[var(--ember)] rounded-sm p-6 transition-colors"
          >
            <p className="font-display text-xl group-hover:text-[var(--ember)] transition-colors">
              {c.category}
            </p>
            <p className="font-mono text-xs text-[var(--muted)] mt-2">
              {c._count.category} {c._count.category === 1 ? "piece" : "pieces"}
            </p>
          </Link>
        ))}
      </FadeIn>
    </section>
  );
}
