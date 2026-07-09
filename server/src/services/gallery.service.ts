import { prisma } from "../lib/prisma.js";
import { createError } from "../middleware/errorHandler.js";
import { uploadService } from "./upload.service.js";

export interface CreateGalleryData {
  id: string;
  url: string;
  title: string;
  description: string;
  category: string;
  date: string;
  localImage?: string;
}

export interface UpdateGalleryData {
  url?: string;
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  localImage?: string;
}

export async function findAll() {
  return prisma.gallery.findMany({
    orderBy: { date: "desc" },
  });
}

export async function findById(id: string) {
  const item = await prisma.gallery.findUnique({ where: { id } });
  if (!item) {
    throw createError("Gallery item not found", 404);
  }
  return item;
}

export async function create(data: CreateGalleryData, file?: Express.Multer.File) {
  let localImage = data.localImage;

  // Si se subió un archivo, procesarlo
  if (file) {
    const uploadedFile = await uploadService.processUploadedFile(file);
    localImage = uploadedFile.url;
  }

  return prisma.gallery.create({
    data: {
      ...data,
      localImage,
    },
  });
}

export async function update(id: string, data: UpdateGalleryData, file?: Express.Multer.File) {
  const existingItem = await findById(id);
  let localImage = data.localImage;

  // Si se subió un nuevo archivo, eliminar el anterior y procesar el nuevo
  if (file) {
    if (existingItem.localImage) {
      await uploadService.deleteFileByUrl(existingItem.localImage);
    }
    const uploadedFile = await uploadService.processUploadedFile(file);
    localImage = uploadedFile.url;
  }

  return prisma.gallery.update({
    where: { id },
    data: {
      ...data,
      localImage,
    },
  });
}

export async function remove(id: string) {
  const item = await findById(id);

  // Eliminar archivo local si existe
  if (item.localImage) {
    await uploadService.deleteFileByUrl(item.localImage);
  }

  return prisma.gallery.delete({ where: { id } });
}
