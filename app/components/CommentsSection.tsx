"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user: {
    name: string | null;
    role: "USER" | "ADMIN";
  };
};

export default function CommentsSection({ blogId }: { blogId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/blogs/${blogId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        if (data.comments) setComments(data.comments);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [blogId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    
    setError("");
    setSubmitting(true);
    
    const res = await fetch(`/api/blogs/${blogId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    
    setSubmitting(false);
    
    if (res.ok) {
      const data = await res.json();
      setComments([data.comment, ...comments]);
      setContent("");
    } else {
      const data = await res.json();
      setError(data.message || "Failed to post comment");
    }
  }

  return (
    <div className="mt-16 border-t border-[var(--line)] pt-12 space-y-8">
      <h3 className="font-mono text-sm tracking-widest uppercase text-[var(--muted)]">
        Reflections ({comments.length})
      </h3>

      {session ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full bg-transparent border border-[var(--line)] focus:border-[var(--ember)] outline-none rounded-sm p-4 text-sm transition-colors min-h-[100px] resize-y font-body text-[var(--paper)]"
            maxLength={500}
          />
          {error && <p className="text-[var(--ember)] text-xs font-mono">{error}</p>}
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-6 py-2 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Post Reflection"}
          </button>
        </form>
      ) : (
        <p className="font-mono text-xs text-[var(--muted)]">
          <Link href="/signin" className="underline hover:text-[var(--ember)] transition-colors">
            Sign in
          </Link>{" "}
          to share a reflection.
        </p>
      )}

      <div className="space-y-6 pt-6">
        {loading ? (
          <p className="font-mono text-xs text-[var(--muted)] animate-pulse">Loading reflections...</p>
        ) : comments.length === 0 ? (
          <p className="font-mono text-xs text-[var(--muted)] italic">Be the first to reflect on this piece.</p>
        ) : (
          comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2 font-mono text-xs tracking-wider">
                <span className={comment.user.role === "ADMIN" ? "text-[var(--ember)]" : "text-[var(--paper)]"}>
                  {comment.user.name || "Anonymous"}
                </span>
                {comment.user.role === "ADMIN" && (
                  <span className="px-1.5 py-0.5 border border-[var(--ember)] text-[var(--ember)] text-[10px] rounded-full uppercase">
                    Author
                  </span>
                )}
                <span className="text-[var(--muted)]">·</span>
                <span className="text-[var(--muted)]">
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="font-body text-sm text-[var(--paper)] whitespace-pre-wrap">
                {comment.content}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
