"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageShell from "../../../components/PageShell";

export default function EditPost() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blogs/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTitle(data.title);
        setCategory(data.category);
        setContent(data.content);
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/blogs/${id}`, {
      method: "PUT",
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

  if (loading) {
    return (
      <PageShell>
        <p className="text-center font-mono text-xs text-[var(--muted)] tracking-widest uppercase">
          Loading...
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto px-8 space-y-4"
      >
        <h1 className="font-display text-4xl mb-6">Edit Post</h1>

        {error && (
          <p className="text-[var(--ember)] font-mono text-sm">{error}</p>
        )}

        <input
          className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 text-sm transition-colors"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 text-sm transition-colors"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-3 h-64 font-body text-base transition-colors"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase"
        >
          Save Changes
        </button>
      </form>
    </PageShell>
  );
}
