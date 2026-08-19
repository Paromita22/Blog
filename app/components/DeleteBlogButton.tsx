"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteBlogButton({
    blogId,
    title,
    redirectTo,
}: {
    blogId: string;
    title: string;
    redirectTo?: string;
}) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm(`Delete "${title}"? This can't be undone.`)) return;

        setDeleting(true);
        const res = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" });
        setDeleting(false);

        if (res.ok) {
            if (redirectTo) {
                router.push(redirectTo);
            } else {
                router.refresh();
            }
        } else {
            alert("Failed to delete post.");
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[var(--ember)] hover:opacity-70 transition-opacity disabled:opacity-50 font-mono text-xs tracking-widest uppercase"
        >
            {deleting ? "Deleting..." : "Delete"}
        </button>
    );
}