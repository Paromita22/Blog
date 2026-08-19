import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";
import { blogSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

// POST: Create a new blog (PROTECTED ROUTE)
export async function POST(req: Request) {
  try {
    // 1. JWT AUTHENTICATION CHECK
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    // 2. Rate limit blog creation per user (5 posts per hour)
    const userId = (session.user as any).id;
    const { allowed } = rateLimit(`blog-create:${userId}`, 5, 60 * 60_000);
    if (!allowed) {
      return NextResponse.json(
        { message: "You're posting too fast. Please wait before creating another post." },
        { status: 429 },
      );
    }
    // 2. Parse and validate the incoming blog data
    const body = await req.json();
    const parsed = blogSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, content, category } = parsed.data;

    // 3. Save the blog to the database and link it to the logged-in user
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        category,
        authorId: userId,
      },
    });

    return NextResponse.json(
      { message: "Blog created successfully!", blog: newBlog },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create Blog Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// GET: Fetch all blogs (PUBLIC ROUTE)
export async function GET() {
  try {
    // Fetch all blogs, ordered by newest first
    // Prisma automatically joins the User table to get the author's name!
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true }, // Only grab the name, keep email/password hidden
        },
      },
    });

    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("Fetch Blogs Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
