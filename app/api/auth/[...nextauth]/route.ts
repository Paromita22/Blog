import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { rateLimit } from "../../../../lib/rateLimit";
import GoogleProvider from "next-auth/providers/google";

// This is the core configuration for how your users log in
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Check if email and password were provided
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        const { allowed } = rateLimit(`login:${credentials.email}`, 5, 60_000);
        if (!allowed) {
          throw new Error("Too many login attempts. Please wait a minute.");
        }

        // 2. Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // 3. Check if the password matches the hashed password in the DB
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // 4. Return the user object if successful (this gets stored in the JWT)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JSON Web Tokens (JWT) for sessions
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const existing = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email!,
              name: user.name,
              password: "", // Google users don't need a local password
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Fetch the user from the database to ensure we get the UUID
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! }
        });

        // Save the database UUID to the token
        if (dbUser) {
          token.id = dbUser.id;
        } else {
          token.id = user.id; // Fallback
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

// Create the NextAuth handler
const handler = NextAuth(authOptions);

// Export it for both GET and POST requests
export { handler as GET, handler as POST };
