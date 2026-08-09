"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-semibold mb-4">New Post</h1>

        {error && <p className="text-red-400">{error}</p>}

        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          placeholder="Category (e.g. Philosophy, Poetry)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3 h-64"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-white text-black rounded-md text-sm uppercase tracking-widest"
        >
          Publish
        </button>
      </form>
    </main>
  );
}
