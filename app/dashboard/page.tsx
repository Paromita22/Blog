import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { prisma } from "../../lib/prisma";
import Link from "next/link";
import BlogRow from "./BlogRow";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id;

  const myBlogs = await prisma.blog.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-[#121212] text-[#e0e0e0] p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold">Your Posts</h1>
          <Link
            href="/dashboard/new"
            className="px-4 py-2 bg-white text-black rounded-md text-sm uppercase tracking-widest"
          >
            + New Post
          </Link>
        </div>

        {myBlogs.length === 0 && (
          <p className="text-gray-400 italic">
            You haven't written anything yet.
          </p>
        )}

        <ul className="space-y-4">
          {myBlogs.map((blog) => (
            <BlogRow key={blog.id} blog={blog} />
          ))}
        </ul>
      </div>
    </main>
  );
}
