import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import Link from "next/link";
import PageShell from "../../components/PageShell";

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      blog: {
        include: { author: { select: { name: true } } },
      },
    },
    orderBy: { id: "desc" },
  });

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-8 space-y-10">
        <div className="space-y-2">
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--muted)]">
            Saved for later
          </p>
          <h1 className="font-display text-4xl md:text-5xl">Your Bookmarks</h1>
        </div>

        {bookmarks.length === 0 && (
          <p className="text-[var(--muted)] italic font-body py-8">
            Nothing bookmarked yet. Find something worth saving in{" "}
            <Link
              href="/blogs"
              className="underline hover:text-[var(--paper)] transition-colors"
            >
              the archive
            </Link>
            .
          </p>
        )}

        <ul className="space-y-1">
          {bookmarks.map((b) => (
            <li key={b.id}>
              <Link
                href={`/blogs/${b.blog.id}`}
                className="group flex items-baseline justify-between border-b border-[var(--line)] py-6 hover:border-[var(--ember)] transition-colors"
              >
                <div>
                  <h2 className="font-display text-2xl group-hover:text-[var(--ember)] transition-colors">
                    {b.blog.title}
                  </h2>
                  <p className="font-mono text-xs text-[var(--muted)] mt-2 uppercase tracking-wider">
                    <span className="text-[var(--ember)]">
                      {b.blog.category}
                    </span>{" "}
                    · by {b.blog.author.name ?? "Anonymous"}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
