import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [postCount, userCount, allContent] = await Promise.all([
      prisma.blog.count(),
      prisma.user.count(),
      prisma.blog.findMany({ select: { content: true } }),
    ]);

    const wordCount = allContent.reduce(
      (sum, blog) =>
        sum + blog.content.trim().split(/\s+/).filter(Boolean).length,
      0,
    );

    return NextResponse.json(
      { postCount, userCount, wordCount },
      { status: 200 },
    );
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
