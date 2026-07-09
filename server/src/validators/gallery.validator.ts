import { z } from "zod";

const urlStringOrPath = z.string().refine(
  (val) => {
    if (val === "") return true;
    try {
      new URL(val);
      return true;
    } catch {
      return val.startsWith("/");
    }
  },
  { message: "Must be a valid URL or path starting with /" }
);

export const galleryCreateSchema = z.object({
  url: urlStringOrPath.optional().or(z.literal("")),
  title: z.string().min(1, "Title is required").max(200, "Title must be 200 characters or fewer"),
  description: z.string().min(1, "Description is required").max(2000, "Description must be 2000 characters or fewer"),
  category: z.enum(["fauna", "flora", "naufragios", "entrenamiento", "paisaje"]),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  localImage: z.string().max(500).optional(),
});

export const galleryUpdateSchema = z.object({
  url: urlStringOrPath.optional().or(z.literal("")),
  title: z.string().min(1, "Title is required").max(200).optional(),
  description: z.string().min(1, "Description is required").max(2000).optional(),
  category: z.enum(["fauna", "flora", "naufragios", "entrenamiento", "paisaje"]).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  localImage: z.string().max(500).optional(),
});
