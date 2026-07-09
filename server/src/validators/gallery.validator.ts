import { z } from "zod";

export const galleryCreateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["fauna", "flora", "naufragios", "entrenamiento", "paisaje"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  localImage: z.string().optional(),
});

export const galleryUpdateSchema = z.object({
  url: z.string().url("Invalid URL format").optional().or(z.literal("")),
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  category: z.enum(["fauna", "flora", "naufragios", "entrenamiento", "paisaje"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  localImage: z.string().optional(),
});
