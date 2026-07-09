import { prisma } from "../lib/prisma.js";
import { createError } from "../middleware/errorHandler.js";

export interface CreateGraduateData {
  name: string;
  certificationCode: string;
  courseName: string;
  graduationDate: string;
  instructorName: string;
  level: string;
}

export interface UpdateGraduateData {
  name?: string;
  certificationCode?: string;
  courseName?: string;
  graduationDate?: string;
  instructorName?: string;
  level?: string;
}

function toDateTime(dateStr: string): Date {
  return new Date(dateStr);
}

export async function findAll(options?: { page?: number; limit?: number }) {
  const page = options?.page || 1;
  const limit = options?.limit || 100;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.graduate.findMany({
      orderBy: { graduationDate: "desc" },
      skip,
      take: limit,
    }),
    prisma.graduate.count(),
  ]);

  return {
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function findById(id: string) {
  const item = await prisma.graduate.findUnique({ where: { id } });
  if (!item) {
    throw createError("Graduate not found", 404);
  }
  return item;
}

export async function findByCertificationCode(code: string) {
  const item = await prisma.graduate.findUnique({
    where: { certificationCode: code },
  });
  if (!item) {
    throw createError("Graduate not found with this certification code", 404);
  }
  return item;
}

export async function search(query: string, limit = 50) {
  const lowerQuery = query.toLowerCase();
  return prisma.graduate.findMany({
    where: {
      OR: [
        { name: { contains: lowerQuery } },
        { certificationCode: { contains: lowerQuery } },
        { courseName: { contains: lowerQuery } },
      ],
    },
    take: limit,
    orderBy: { graduationDate: "desc" },
  });
}

export async function create(data: CreateGraduateData) {
  return prisma.graduate.create({
    data: {
      name: data.name,
      certificationCode: data.certificationCode,
      courseName: data.courseName,
      graduationDate: new Date(data.graduationDate),
      instructorName: data.instructorName,
      level: data.level,
    },
  });
}

export async function update(id: string, data: UpdateGraduateData) {
  await findById(id);
  const updateData: Record<string, any> = { ...data };
  if (data.graduationDate) {
    updateData.graduationDate = new Date(data.graduationDate);
  }
  return prisma.graduate.update({ where: { id }, data: updateData });
}

export async function remove(id: string) {
  await findById(id);
  return prisma.graduate.delete({ where: { id } });
}
