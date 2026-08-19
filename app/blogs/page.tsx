import Link from "next/link";
import { prisma } from "../../lib/prisma";
import PageShell from "../components/PageShell";
import FadeIn from "../components/FadeIn";

const PAGE_SIZE = 6;

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category;

  const where = category ? { category } : {};

  const featuredBlogs = await prisma.blog.findMany({
    where: { ...where, author: { role: "ADMIN" } },
    orderBy: { createdAt: "desc" },
    take: 3, // Just show top 3 featured
    include: { author: { select: { name: true } } },
  });

  const blogs = await prisma.blog.findMany({
    where: { ...where, author: { role: "USER" } }, // regular blogs
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { author: { select: { name: true } } },
  });

  const total = await prisma.blog.count({
    where: { ...where, author: { role: "USER" } },
  });

  const categories = await prisma.blog.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-8 space-y-10">
        <FadeIn className="space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
            The Archive
          </p>
          <h1 className="font-display text-4xl md:text-5xl">All Writings</h1>
        </FadeIn>

        <FadeIn className="flex gap-3 flex-wrap">
          <Link
            href="/blogs"
            className={`px-4 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase transition-colors ${
              !category
                ? "bg-[var(--ember)] border-[var(--ember)] text-[var(--paper)]"
                : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ember)] hover:text-[var(--ember)]"
            }`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/blogs?category=${encodeURIComponent(c.category)}`}
              className={`px-4 py-1.5 rounded-full border text-xs font-mono tracking-widest uppercase transition-colors ${
                category === c.category
                  ? "bg-[var(--ember)] border-[var(--ember)] text-[var(--paper)]"
                  : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--ember)] hover:text-[var(--ember)]"
              }`}
            >
              {c.category}
            </Link>
          ))}
        </FadeIn>

        {featuredBlogs.length > 0 && page === 1 && (
          <FadeIn className="space-y-4 pt-8">
            <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--ember)]">
              Featured Reflections
            </h3>
            <ul className="space-y-1">
              {featuredBlogs.map((blog) => (
                <li key={blog.id}>
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="group flex items-baseline justify-between border-b border-[var(--ember)]/30 py-6 hover:border-[var(--ember)] transition-colors"
                  >
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl text-[var(--paper)] group-hover:text-[var(--ember)] transition-colors">
                        {blog.title}
                      </h2>
                      <p className="font-mono text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">
                        <span className="text-[var(--ember)]">{blog.category}</span>{" "}
                        · by {blog.author.name ?? "Anonymous"}
                      </p>
                    </div>
                    <span className="font-mono text-xs text-[var(--muted)] shrink-0 ml-4">
                      {blog.views} views
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </FadeIn>
        )}

        <FadeIn className="space-y-4 pt-8">
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
            Community Archive
          </h3>
          <ul className="space-y-1">
            {blogs.map((blog) => (
              <li key={blog.id}>
                <Link
                  href={`/blogs/${blog.id}`}
                  className="group flex items-baseline justify-between border-b border-[var(--line)] py-6 hover:border-[var(--ember)] transition-colors"
                >
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl group-hover:text-[var(--ember)] transition-colors">
                      {blog.title}
                    </h2>
                    <p className="font-mono text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">
                      <span className="text-[var(--ember)]">{blog.category}</span>{" "}
                      · by {blog.author.name ?? "Anonymous"}
                    </p>
                  </div>
                  <span className="font-mono text-xs text-[var(--muted)] shrink-0 ml-4">
                    {blog.views} views
                  </span>
                </Link>
              </li>
            ))}
            {blogs.length === 0 && (
              <p className="text-[var(--muted)] italic font-body py-8">
                No posts found here.
              </p>
            )}
          </ul>
        </FadeIn>

        <FadeIn className="flex gap-6 justify-center font-mono text-xs tracking-widest uppercase pt-4">
          {page > 1 && (
            <Link
              href={`/blogs?page=${page - 1}${category ? `&category=${category}` : ""}`}
              className="text-[var(--muted)] hover:text-[var(--ember)] transition-colors"
            >
              ← Prev
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/blogs?page=${page + 1}${category ? `&category=${category}` : ""}`}
              className="text-[var(--muted)] hover:text-[var(--ember)] transition-colors"
            >
              Next →
            </Link>
          )}
        </FadeIn>
      </div>
    </PageShell>
  );
}
