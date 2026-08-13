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

  const existing = await prisma.like.findUnique({
    where: { userId_blogId: { userId, blogId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return NextResponse.json({ liked: false }, { status: 200 });
  } else {
    await prisma.like.create({ data: { userId, blogId } });
    return NextResponse.json({ liked: true }, { status: 200 });
  }
}
