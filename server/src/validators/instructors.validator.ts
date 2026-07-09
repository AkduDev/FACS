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

export const instructorCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Name must be 150 characters or fewer"),
  bio: z.string().min(1, "Bio is required").max(2000, "Bio must be 2000 characters or fewer"),
  level: z.string().min(1, "Level is required").max(100),
  certificationCode: z.string().min(1, "Certification code is required").max(50),
  photo: urlStringOrPath.optional().or(z.literal("")),
  localPhoto: z.string().max(500).optional(),
  experienceYears: z.number().int().min(0, "Experience years must be positive").max(100),
});

export const instructorUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(150).optional(),
  bio: z.string().min(1, "Bio is required").max(2000).optional(),
  level: z.string().min(1, "Level is required").max(100).optional(),
  certificationCode: z.string().min(1, "Certification code is required").max(50).optional(),
  photo: urlStringOrPath.optional().or(z.literal("")),
  localPhoto: z.string().max(500).optional(),
  experienceYears: z.number().int().min(0, "Experience years must be positive").max(100).optional(),
});
