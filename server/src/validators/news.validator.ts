import { z } from "zod";

export const newsCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  content: z.string().min(1, "Content is required").max(50000, "Content must be 50000 characters or fewer"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().max(500).optional(),
  author: z.string().min(1, "Author is required").max(100, "Author must be 100 characters or fewer"),
  category: z.enum(["conservacion", "federacion", "seguridad", "exploracion"]),
});

export const newsUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  content: z.string().min(1, "Content is required").max(50000).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().max(500).optional(),
  author: z.string().min(1, "Author is required").max(100).optional(),
  category: z.enum(["conservacion", "federacion", "seguridad", "exploracion"]).optional(),
});
