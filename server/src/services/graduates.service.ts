import { prisma } from "../lib/prisma.js";
import { createError } from "../middleware/errorHandler.js";

export interface CreateGraduateData {
  id: string;
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

export async function findAll() {
  return prisma.graduate.findMany({
    orderBy: { graduationDate: "desc" },
  });
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

export async function search(query: string) {
  const lowerQuery = query.toLowerCase();
  return prisma.graduate.findMany({
    where: {
      OR: [
        { name: { contains: lowerQuery } },
        { certificationCode: { contains: lowerQuery } },
        { courseName: { contains: lowerQuery } },
      ],
    },
    orderBy: { graduationDate: "desc" },
  });
}

export async function create(data: CreateGraduateData) {
  return prisma.graduate.create({ data });
}

export async function update(id: string, data: UpdateGraduateData) {
  await findById(id);
  return prisma.graduate.update({
    where: { id },
    data,
  });
}

export async function remove(id: string) {
  await findById(id);
  return prisma.graduate.delete({ where: { id } });
}
