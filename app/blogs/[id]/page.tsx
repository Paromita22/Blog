import { prisma } from "../../../lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import PageShell from "../../components/PageShell";
import PostActions from "./PostActions";

export default async function BlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;

  await prisma.blog
    .update({
      where: { id },
      data: { views: { increment: 1 } },
    })
    .catch(() => null);

  const blog = await prisma.blog.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } },
      likes: userId ? { where: { userId } } : false,
      bookmarks: userId ? { where: { userId } } : false,
    },
  });

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
        <div className="h-px bg-[var(--line)]" />
        <PostActions
          blogId={blog.id}
          initialLiked={userId ? blog.likes.length > 0 : false}
          initialBookmarked={userId ? blog.bookmarks.length > 0 : false}
          initialLikeCount={blog._count.likes}
          isLoggedIn={!!userId}
        />
      </article>
    </PageShell>
  );
}
