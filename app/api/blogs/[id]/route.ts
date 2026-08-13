import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "../../../../lib/prisma";
import { blogSchema } from "@/lib/validation";

// GET a single blog (public)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!blog) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  return NextResponse.json(blog, { status: 200 });
}

// PUT: update a blog (owner only)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (blog.authorId !== (session.user as any).id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = blogSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", errors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  const { title, content, category } = parsed.data;

  const updated = await prisma.blog.update({
    where: { id },
    data: { title, content, category },
  });

  return NextResponse.json(updated, { status: 200 });
}

// DELETE: remove a blog (owner only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }
  if (blog.authorId !== (session.user as any).id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
