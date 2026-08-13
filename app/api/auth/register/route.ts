import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    console.log("1. API hit! Parsing body...");
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
    const { email, name, password } = parsed.data;

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
      data: { email, name, password: hashedPassword },
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
