import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import PageShell from "../../components/PageShell";

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
    <PageShell>
      <article className="max-w-2xl mx-auto px-8 space-y-8">
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full border border-[var(--ember)] text-[var(--ember)] text-xs font-mono tracking-widest uppercase">
            {blog.category}
          </span>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">
            {blog.title}
          </h1>
          <p className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">
            by {blog.author.name ?? "Anonymous"} · {blog.views} views
          </p>
        </div>
        <div className="h-px bg-[var(--line)]" />
        <div className="font-body text-lg leading-relaxed whitespace-pre-wrap text-[var(--paper)]">
          {blog.content}
        </div>
      </article>
    </PageShell>
  );
}
