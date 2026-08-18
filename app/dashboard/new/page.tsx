"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "../../components/PageShell";

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, category }),
    });

    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.message || "Something went wrong");
    }
  }

  return (
    <PageShell>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto px-8 space-y-4"
      >
        <h1 className="font-display text-4xl mb-6">New Post</h1>

        {error && (
          <p className="text-[var(--ember)] font-mono text-sm">{error}</p>
        )}

        <input
          className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 text-sm transition-colors"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 text-sm transition-colors"
          placeholder="Category (e.g. Philosophy, Poetry)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 h-64 font-body text-base transition-colors"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase"
        >
          Publish
        </button>
      </form>
    </PageShell>
  );
}
