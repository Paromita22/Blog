import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    console.log("1. API hit! Parsing body...");

    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    const { allowed } = rateLimit(`register:${ip}`, 5, 60_000); // 5 requests per 60s per IP

    if (!allowed) {
      return NextResponse.json(
        { message: "Too many attempts. Please try again in a minute." },
        { status: 429 },
      );
    }

    const body = await req.json();

    console.log("1b. Validating input...");
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { email, name, password, website } = parsed.data;

    if (website) {
      console.warn("Honeypot filled. Rejecting bot.");
      // We can return a fake success to fool the bot, or a 400.
      return NextResponse.json({ message: "Registration successful" }, { status: 200 });
    }

    console.log("2. Checking for existing user...");

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      console.log("User already exists!");
      return NextResponse.json({ message: "User exists" }, { status: 409 });
    }

    console.log("3. Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("4. Saving to database...");
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: email === "paromitachanda04@gmail.com" ? "ADMIN" : "USER",
      },
    });

    console.log("5. Success! Returning response.");
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { email: newUser.email },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
