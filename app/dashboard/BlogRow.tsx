"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BlogRow({
  blog,
}: {
  blog: { id: string; title: string; category: string; views: number };
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${blog.title}"? This can't be undone.`)) return;

    setDeleting(true);
    const res = await fetch(`/api/blogs/${blog.id}`, { method: "DELETE" });
    setDeleting(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete post.");
    }
  }

  return (
    <li className="border border-[var(--line)] hover:border-[var(--ember)] transition-colors rounded-sm p-5 flex justify-between items-center">
      <div>
        <h2 className="font-display text-xl">{blog.title}</h2>
        <p className="font-mono text-xs text-[var(--muted)] mt-1 uppercase tracking-wider">
          <span className="text-[var(--ember)]">{blog.category}</span> ·{" "}
          {blog.views} views
        </p>
      </div>
      <div className="flex gap-4 font-mono text-xs tracking-widest uppercase shrink-0">
        <Link
          href={`/dashboard/edit/${blog.id}`}
          className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-[var(--ember)] hover:opacity-70 transition-opacity disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
