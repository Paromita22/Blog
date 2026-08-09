import Link from "next/link";
import { prisma } from "../../lib/prisma";

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

  const [blogs, total, categories] = await Promise.all([
    prisma.blog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { author: { select: { name: true } } },
    }),
    prisma.blog.count({ where }),
    prisma.blog.findMany({
      select: { category: true },
      distinct: ["category"],
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-semibold">All Writings</h1>

        {/* Category filter */}
        <div className="flex gap-3 flex-wrap text-sm">
          <Link
            href="/blogs"
            className={`px-3 py-1 rounded-full border ${!category ? "bg-white text-black" : "border-gray-600"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.category}
              href={`/blogs?category=${encodeURIComponent(c.category)}`}
              className={`px-3 py-1 rounded-full border ${category === c.category ? "bg-white text-black" : "border-gray-600"}`}
            >
              {c.category}
            </Link>
          ))}
        </div>

        {/* Blog list */}
        <ul className="space-y-6">
          {blogs.map((blog) => (
            <li key={blog.id} className="border-b border-gray-800 pb-6">
              <Link href={`/blogs/${blog.id}`}>
                <h2 className="text-2xl hover:underline">{blog.title}</h2>
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                {blog.category} · by {blog.author.name ?? "Anonymous"} ·{" "}
                {blog.views} views
              </p>
            </li>
          ))}
          {blogs.length === 0 && (
            <p className="text-gray-400 italic">No posts yet.</p>
          )}
        </ul>

        {/* Pagination */}
        <div className="flex gap-4 justify-center text-sm">
          {page > 1 && (
            <Link
              href={`/blogs?page=${page - 1}${category ? `&category=${category}` : ""}`}
            >
              ← Prev
            </Link>
          )}
          {page < totalPages && (
            <Link
              href={`/blogs?page=${page + 1}${category ? `&category=${category}` : ""}`}
            >
              Next →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
