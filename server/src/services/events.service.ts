import { prisma } from "../lib/prisma.js";
import { createError } from "../middleware/errorHandler.js";
import { uploadService } from "./upload.service.js";

export interface CreateEventData {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
  image?: string;
  localImage?: string;
}

export interface UpdateEventData {
  title?: string;
  date?: string;
  location?: string;
  description?: string;
  category?: string;
  image?: string;
  localImage?: string;
}

export async function findAll() {
  return prisma.event.findMany({
    orderBy: { date: "desc" },
  });
}

export async function findById(id: string) {
  const item = await prisma.event.findUnique({ where: { id } });
  if (!item) {
    throw createError("Event not found", 404);
  }
  return item;
}

export async function create(data: CreateEventData, file?: Express.Multer.File) {
  let localImage = data.localImage;

  if (file) {
    const uploadedFile = await uploadService.processUploadedFile(file);
    localImage = uploadedFile.url;
  }

  return prisma.event.create({
    data: {
      ...data,
      localImage,
    },
  });
}

export async function update(id: string, data: UpdateEventData, file?: Express.Multer.File) {
  const existingItem = await findById(id);
  let localImage = data.localImage;

  if (file) {
    if (existingItem.localImage) {
      await uploadService.deleteFileByUrl(existingItem.localImage);
    }
    const uploadedFile = await uploadService.processUploadedFile(file);
    localImage = uploadedFile.url;
  }

  return prisma.event.update({
    where: { id },
    data: {
      ...data,
      localImage,
    },
  });
}

export async function remove(id: string) {
  const item = await findById(id);

  if (item.localImage) {
    await uploadService.deleteFileByUrl(item.localImage);
  }

  return prisma.event.delete({ where: { id } });
}
