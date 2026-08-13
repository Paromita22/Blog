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
      router.refresh(); // re-fetches the server component's data
    } else {
      alert("Failed to delete post.");
    }
  }

  return (
    <li className="border border-gray-700 rounded-md p-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl">{blog.title}</h2>
        <p className="text-sm text-gray-500">
          {blog.category} · {blog.views} views
        </p>
      </div>
      <div className="flex gap-3 text-sm">
        <Link href={`/dashboard/edit/${blog.id}`} className="underline">
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 underline disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
}
