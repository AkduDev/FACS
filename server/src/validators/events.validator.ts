import { z } from "zod";

export const eventCreateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  title: z.string().min(1, "Title is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["competicion", "limpieza", "curso", "reunion"]),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().optional(),
});

export const eventUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  location: z.string().min(1, "Location is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  category: z.enum(["competicion", "limpieza", "curso", "reunion"]).optional(),
  image: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localImage: z.string().optional(),
});
