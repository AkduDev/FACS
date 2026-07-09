import { z } from "zod";

export const graduateCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(150, "Name must be 150 characters or fewer"),
  certificationCode: z.string().min(1, "Certification code is required").max(50),
  courseName: z.string().min(1, "Course name is required").max(200),
  graduationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
  instructorName: z.string().min(1, "Instructor name is required").max(150),
  level: z.enum(["1-star", "2-star", "3-star", "divemaster", "instructor"]),
});

export const graduateUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(150).optional(),
  certificationCode: z.string().min(1, "Certification code is required").max(50).optional(),
  courseName: z.string().min(1, "Course name is required").max(200).optional(),
  graduationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format").optional(),
  instructorName: z.string().min(1, "Instructor name is required").max(150).optional(),
  level: z.enum(["1-star", "2-star", "3-star", "divemaster", "instructor"]).optional(),
});

export const graduateSearchSchema = z.object({
  q: z.string().min(1, "Search query is required").max(100, "Search query must be 100 characters or fewer"),
});
