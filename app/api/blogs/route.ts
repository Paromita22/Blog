import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "../../../lib/prisma";

// POST: Create a new blog (PROTECTED ROUTE)
export async function POST(req: Request) {
  try {
    // 1. JWT AUTHENTICATION CHECK (CV Highlight: Private Route Protection)
    // This securely reads the JWT token from the user's browser
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 },
      );
    }

    // 2. Parse the incoming blog data
    const body = await req.json();
    const { title, content, category } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // 3. Save the blog to the database and link it to the logged-in user
    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        category,
        authorId: (session.user as any).id, // Automatically grabs ID from JWT
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
