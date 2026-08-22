"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";

type Result = { id: string; title: string; category: string };

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/blogs/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setResults(data.results || []))
        .finally(() => setLoading(false));
    }, 300); // debounce

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {open ? (
        <div className="flex items-center gap-2 border border-[var(--line)] focus-within:border-[var(--ember)] rounded-sm px-3 py-1.5 transition-colors bg-[var(--ink)]">
          <Search size={14} className="text-[var(--muted)] shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search writings..."
            className="bg-transparent outline-none text-xs w-32 sm:w-48 font-mono"
          />
          <button
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          >
            <X
              size={14}
              className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
            />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="text-[var(--muted)] hover:text-[var(--paper)] transition-colors"
          aria-label="Search"
        >
          <Search size={16} />
        </button>
      )}

      {open && query.trim().length >= 2 && (
        <div className="absolute right-0 mt-2 w-72 bg-[var(--ink)] border border-[var(--line)] rounded-sm shadow-lg max-h-80 overflow-y-auto z-50">
          {loading ? (
            <p className="p-4 text-xs font-mono text-[var(--muted)]">
              Searching...
            </p>
          ) : results.length === 0 ? (
            <p className="p-4 text-xs font-mono text-[var(--muted)]">
              No results found.
            </p>
          ) : (
            results.map((r) => (
              <Link
                key={r.id}
                href={`/blogs/${r.id}`}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 hover:bg-[var(--line)]/20 transition-colors border-b border-[var(--line)] last:border-0"
              >
                <p className="font-display text-sm">{r.title}</p>
                <p className="font-mono text-[10px] text-[var(--ember)] uppercase tracking-wider mt-1">
                  {r.category}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
