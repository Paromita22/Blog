"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

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

  if (loading) return <p className="text-white p-8">Loading...</p>;

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-semibold mb-4">Edit Post</h1>

        {error && <p className="text-red-400">{error}</p>}

        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <textarea
          className="w-full bg-[#1e1e1e] border border-gray-700 rounded-md p-3 h-64"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-white text-black rounded-md text-sm uppercase tracking-widest"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}
