import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const blog = await prisma.blog
    .update({
      where: { id },
      data: { views: { increment: 1 } },
      include: { author: { select: { name: true } } },
    })
    .catch(() => null);

  if (!blog) return notFound();

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8">
      <article className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-semibold">{blog.title}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {blog.category} · by {blog.author.name ?? "Anonymous"} ·{" "}
            {blog.views} views
          </p>
        </div>
        <div className="prose prose-invert whitespace-pre-wrap leading-relaxed">
          {blog.content}
        </div>
      </article>
    </main>
  );
}
