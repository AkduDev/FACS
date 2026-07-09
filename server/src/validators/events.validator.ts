import { z } from "zod";

export const eventCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  location: z.string().min(1, "Location is required").max(200, "Location must be 200 characters or fewer"),
  description: z.string().min(1, "Description is required").max(5000, "Description must be 5000 characters or fewer"),
  category: z.enum(["competicion", "limpieza", "curso", "reunion"]),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().max(500).optional(),
});

export const eventUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  location: z.string().min(1, "Location is required").max(200).optional(),
  description: z.string().min(1, "Description is required").max(5000).optional(),
  category: z.enum(["competicion", "limpieza", "curso", "reunion"]).optional(),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().max(500).optional(),
});
