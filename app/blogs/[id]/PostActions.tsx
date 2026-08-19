"use client";

import { useState } from "react";
import Link from "next/link";

export default function PostActions({
  blogId,
  initialLiked,
  initialBookmarked,
  initialLikeCount,
  isLoggedIn,
}: {
  blogId: string;
  initialLiked: boolean;
  initialBookmarked: boolean;
  initialLikeCount: number;
  isLoggedIn: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    console.log(
      "toggleLike called, blogId:",
      blogId,
      "isLoggedIn:",
      isLoggedIn,
    );
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/blogs/${blogId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount((c) => (data.liked ? c + 1 : c - 1));
      } else {
        const err = await res.json().catch(() => ({}));
        console.error("Like failed:", res.status, err);
      }
    } catch (e) {
      console.error("Like request error:", e);
    }
    setLoading(false);
  }

  async function toggleBookmark() {
    if (!isLoggedIn) return;
    setLoading(true);
    const res = await fetch(`/api/blogs/${blogId}/bookmark`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setBookmarked(data.bookmarked);
    }
    setLoading(false);
  }

  if (!isLoggedIn) {
    return (
      <p className="font-mono text-xs text-[var(--muted)]">
        <Link
          href="/signin"
          className="underline hover:text-[var(--ember)] transition-colors"
        >
          Sign in
        </Link>{" "}
        to like or bookmark this piece.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-6">
      <button
        onClick={toggleLike}
        disabled={loading}
        className={`flex items-center gap-2 font-mono text-sm tracking-widest uppercase transition-colors disabled:opacity-50 ${
          liked
            ? "text-[var(--ember)]"
            : "text-[var(--muted)] hover:text-[var(--paper)]"
        }`}
      >
        <span className="text-lg">{liked ? "♥" : "♡"}</span>
        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </button>

      <button
        onClick={toggleBookmark}
        disabled={loading}
        className={`flex items-center gap-2 font-mono text-sm tracking-widest uppercase transition-colors disabled:opacity-50 ${
          bookmarked
            ? "text-[var(--ember)]"
            : "text-[var(--muted)] hover:text-[var(--paper)]"
        }`}
      >
        <span className="text-lg">{bookmarked ? "★" : "☆"}</span>
        {bookmarked ? "Bookmarked" : "Bookmark"}
      </button>
    </div>
  );
}
