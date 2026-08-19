import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { prisma } from "../../../../../lib/prisma";
import { rateLimit } from "../../../../../lib/rateLimit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: blogId } = await params;
    
    const comments = await prisma.comment.findMany({
      where: { blogId },
      include: {
        user: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Fetch comments error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: blogId } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    
    // Rate limit comment posting
    const { allowed } = rateLimit(`comment:${userId}`, 3, 60_000); // 3 comments per minute
    if (!allowed) {
      return NextResponse.json({ message: "Too many comments. Please wait." }, { status: 429 });
    }
    
    const body = await req.json();
    if (!body.content || typeof body.content !== "string" || body.content.trim().length === 0) {
      return NextResponse.json({ message: "Comment content is required" }, { status: 400 });
    }
    
    const comment = await prisma.comment.create({
      data: {
        content: body.content.trim().slice(0, 500), // Max 500 chars
        userId,
        blogId,
      },
      include: {
        user: { select: { name: true, role: true } },
      },
    });
    
    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error("Post comment error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
