import { prisma } from "../lib/prisma.js";
import { createError } from "../middleware/errorHandler.js";
import { uploadService } from "./upload.service.js";

export interface CreateNewsData {
  id: string;
  title: string;
  content: string;
  date: string;
  image?: string;
  localImage?: string;
  author: string;
  category: string;
}

export interface UpdateNewsData {
  title?: string;
  content?: string;
  date?: string;
  image?: string;
  localImage?: string;
  author?: string;
  category?: string;
}

export async function findAll() {
  return prisma.news.findMany({
    orderBy: { date: "desc" },
  });
}

export async function findById(id: string) {
  const item = await prisma.news.findUnique({ where: { id } });
  if (!item) {
    throw createError("News item not found", 404);
  }
  return item;
}

export async function create(data: CreateNewsData, file?: Express.Multer.File) {
  let localImage = data.localImage;

  if (file) {
    const uploadedFile = await uploadService.processUploadedFile(file);
    localImage = uploadedFile.url;
  }

  return prisma.news.create({
    data: {
      ...data,
      localImage,
    },
  });
}

export async function update(id: string, data: UpdateNewsData, file?: Express.Multer.File) {
  const existingItem = await findById(id);
  let localImage = data.localImage;

  if (file) {
    if (existingItem.localImage) {
      await uploadService.deleteFileByUrl(existingItem.localImage);
    }
    const uploadedFile = await uploadService.processUploadedFile(file);
    localImage = uploadedFile.url;
  }

  return prisma.news.update({
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

  return prisma.news.delete({ where: { id } });
}
