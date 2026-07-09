import { z } from "zod";

export const newsCreateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  category: z.enum(["conservacion", "federacion", "seguridad", "exploracion"]),
});

export const newsUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  content: z.string().min(1, "Content is required").optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().optional(),
  author: z.string().min(1, "Author is required").optional(),
  category: z.enum(["conservacion", "federacion", "seguridad", "exploracion"]).optional(),
});
