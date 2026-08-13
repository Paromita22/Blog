import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100).optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const blogSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  category: z.string().min(1).max(50),
});
