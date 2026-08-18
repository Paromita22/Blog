import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";
import Link from "next/link";
import PageShell from "../components/PageShell";
import BlogRow from "./BlogRow";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const myBlogs = await prisma.blog.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-8 space-y-10">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
              Your Desk
            </p>
            <h1 className="font-display text-4xl md:text-5xl">Your Posts</h1>
          </div>
          <Link
            href="/dashboard/new"
            className="px-6 py-2 bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ember)] hover:text-[var(--paper)] transition-colors rounded-sm text-xs font-mono tracking-widest uppercase shrink-0"
          >
            + New Post
          </Link>
        </div>

        {myBlogs.length === 0 && (
          <p className="text-[var(--muted)] italic font-body py-8">
            You haven't written anything yet.
          </p>
        )}

        <ul className="space-y-4">
          {myBlogs.map((blog) => (
            <BlogRow key={blog.id} blog={blog} />
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
