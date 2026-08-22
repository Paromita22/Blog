import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type SearchResult = {
  id: string;
  title: string;
  category: string;
  rank: number;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] }, { status: 200 });
  }

  try {
    const results: SearchResult[] = await prisma.$queryRaw`
      SELECT id, title, category,
        ts_rank(search_vector, websearch_to_tsquery('english', ${q})) AS rank
      FROM "Blog"
      WHERE search_vector @@ websearch_to_tsquery('english', ${q})
      ORDER BY rank DESC
      LIMIT 10
    `;

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ message: "Search failed" }, { status: 500 });
  }
}
