import { z } from "zod";

export const instructorCreateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  level: z.string().min(1, "Level is required"),
  certificationCode: z.string().min(1, "Certification code is required"),
  photo: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localPhoto: z.string().optional(),
  experienceYears: z.number().int().min(0, "Experience years must be positive"),
});

export const instructorUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  bio: z.string().min(1, "Bio is required").optional(),
  level: z.string().min(1, "Level is required").optional(),
  certificationCode: z.string().min(1, "Certification code is required").optional(),
  photo: z.string().url("Invalid URL format").optional().or(z.literal("")),
  localPhoto: z.string().optional(),
  experienceYears: z.number().int().min(0, "Experience years must be positive").optional(),
});
