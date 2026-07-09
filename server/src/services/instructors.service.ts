import { prisma } from "../lib/prisma.js";
import { createError } from "../middleware/errorHandler.js";
import { uploadService } from "./upload.service.js";

export interface CreateInstructorData {
  id: string;
  name: string;
  bio: string;
  level: string;
  certificationCode: string;
  photo: string;
  localPhoto?: string;
  experienceYears: number;
}

export interface UpdateInstructorData {
  name?: string;
  bio?: string;
  level?: string;
  certificationCode?: string;
  photo?: string;
  localPhoto?: string;
  experienceYears?: number;
}

export async function findAll() {
  return prisma.instructor.findMany({
    orderBy: { experienceYears: "desc" },
  });
}

export async function findById(id: string) {
  const item = await prisma.instructor.findUnique({ where: { id } });
  if (!item) {
    throw createError("Instructor not found", 404);
  }
  return item;
}

export async function create(data: CreateInstructorData, file?: Express.Multer.File) {
  let localPhoto = data.localPhoto;

  if (file) {
    const uploadedFile = await uploadService.processUploadedFile(file);
    localPhoto = uploadedFile.url;
  }

  return prisma.instructor.create({
    data: {
      ...data,
      localPhoto,
    },
  });
}

export async function update(id: string, data: UpdateInstructorData, file?: Express.Multer.File) {
  const existingItem = await findById(id);
  let localPhoto = data.localPhoto;

  if (file) {
    if (existingItem.localPhoto) {
      await uploadService.deleteFileByUrl(existingItem.localPhoto);
    }
    const uploadedFile = await uploadService.processUploadedFile(file);
    localPhoto = uploadedFile.url;
  }

  return prisma.instructor.update({
    where: { id },
    data: {
      ...data,
      localPhoto,
    },
  });
}

export async function remove(id: string) {
  const item = await findById(id);

  if (item.localPhoto) {
    await uploadService.deleteFileByUrl(item.localPhoto);
  }

  return prisma.instructor.delete({ where: { id } });
}
