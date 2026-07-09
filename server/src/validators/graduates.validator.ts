import { z } from "zod";

export const graduateCreateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  certificationCode: z.string().min(1, "Certification code is required"),
  courseName: z.string().min(1, "Course name is required"),
  graduationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  instructorName: z.string().min(1, "Instructor name is required"),
  level: z.enum(["1-star", "2-star", "3-star", "divemaster", "instructor"]),
});

export const graduateUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  certificationCode: z.string().min(1, "Certification code is required").optional(),
  courseName: z.string().min(1, "Course name is required").optional(),
  graduationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  instructorName: z.string().min(1, "Instructor name is required").optional(),
  level: z.enum(["1-star", "2-star", "3-star", "divemaster", "instructor"]).optional(),
});

export const graduateSearchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
});
