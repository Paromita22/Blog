import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: blogId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;

  const existing = await prisma.bookmark.findUnique({
    where: { userId_blogId: { userId, blogId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    return NextResponse.json({ bookmarked: false }, { status: 200 });
  } else {
    await prisma.bookmark.create({ data: { userId, blogId } });
    return NextResponse.json({ bookmarked: true }, { status: 200 });
  }
}
