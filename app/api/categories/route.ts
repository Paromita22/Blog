import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.blog.groupBy({
      by: ["category"],
      _count: { category: true },
      orderBy: { _count: { category: "desc" } },
    });

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Categories error:", error);
    return NextResponse.json({ message: "Failed" }, { status: 500 });
  }
}
