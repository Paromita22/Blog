"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Blog = {
  id: string;
  title: string;
  category: string;
  views: number;
  author: { name: string | null };
};

export default function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch("/api/blogs/featured")
      .then((res) => res.json())
      .then(setBlogs)
      .catch(() => setBlogs([]));
  }, []);

  if (blogs.length === 0) return null;

  return (
    <section className="relative px-8 md:px-16 py-24 md:py-32 max-w-5xl mx-auto">
      <motion.p
        className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)] mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Most Read
      </motion.p>

      <div className="space-y-1">
        {blogs.map((blog, i) => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link
              href={`/blogs/${blog.id}`}
              className="group flex items-baseline justify-between border-b border-[var(--line)] py-6 hover:border-[var(--ember)] transition-colors"
            >
              <div>
                <h3 className="font-display text-2xl md:text-3xl group-hover:text-[var(--ember)] transition-colors">
                  {blog.title}
                </h3>
                <p className="font-mono text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">
                  <span className="text-[var(--ember)]">{blog.category}</span> ·{" "}
                  {blog.author.name ?? "Anonymous"}
                </p>
              </div>
              <span className="font-mono text-xs text-[var(--muted)] shrink-0 ml-4">
                {blog.views} views
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
