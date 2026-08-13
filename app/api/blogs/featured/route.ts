import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const blogs = await prisma.blog.findMany({
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true } },
    },
  });

  const featured = blogs
    .sort(
      (a, b) => b.views + b._count.likes * 2 - (a.views + a._count.likes * 2),
    )
    .slice(0, 3);

  return NextResponse.json(featured, { status: 200 });
}
