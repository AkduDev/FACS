import { PrismaClient, Prisma } from "@prisma/client";
import { createError } from "../middleware/errorHandler.js";
import { uploadService } from "../services/upload.service.js";
import { prisma } from "./prisma.js";

export interface CrudServiceConfig {
  modelName: string;
  orderBy?: Record<string, string>;
  localImageField?: string;
  dateFields?: string[];
  notFoundMessage?: string;
  selectFields?: string[];
  maxLimit?: number;
}

function convertDates(data: Record<string, any>, dateFields: string[]): Record<string, any> {
  const converted = { ...data };
  for (const field of dateFields) {
    if (converted[field] && typeof converted[field] === "string") {
      converted[field] = new Date(converted[field]);
    }
  }
  return converted;
}

export function createCrudService<T extends Record<string, unknown>>(
  prismaModel: any,
  config: CrudServiceConfig
) {
  const {
    orderBy = { createdAt: "desc" },
    localImageField,
    dateFields = [],
    notFoundMessage,
    selectFields,
    maxLimit = 100,
  } = config;

  async function findAll(options?: { page?: number; limit?: number; select?: string[] }) {
    const page = options?.page || 1;
    const limit = Math.min(options?.limit || 20, maxLimit);
    const skip = (page - 1) * limit;

    const selectObj: Record<string, true> | undefined = selectFields
      ? Object.fromEntries(selectFields.map(f => [f, true as const]))
      : undefined;

    const [items, total] = await Promise.all([
      prismaModel.findMany({
        orderBy,
        skip,
        take: limit,
        ...(selectObj ? { select: selectObj as any } : {}),
      }),
      prismaModel.count(),
    ]);

    return {
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async function findById(id: string) {
    const item = await prismaModel.findUnique({ where: { id } });
    if (!item) {
      throw createError(
        notFoundMessage || `${config.modelName} not found`,
        404
      );
    }
    return item;
  }

  async function create(data: Record<string, any>, file?: Express.Multer.File) {
    let imageData: Record<string, any> = {};

    if (file && localImageField) {
      const uploadedFile = await uploadService.processUploadedFile(file);
      imageData[localImageField] = uploadedFile.url;
    }

    const convertedData = convertDates({ ...data, ...imageData }, dateFields);

    return prismaModel.create({
      data: convertedData,
    });
  }

  async function update(
    id: string,
    data: Record<string, any>,
    file?: Express.Multer.File
  ) {
    return prisma.$transaction(async (tx) => {
      const existingItem = await (tx as any)[config.modelName].findUnique({ where: { id } });
      if (!existingItem) {
        throw createError(notFoundMessage || `${config.modelName} not found`, 404);
      }

      let imageData: Record<string, any> = {};
      if (file && localImageField) {
        const existingImageUrl = (existingItem as any)[localImageField];
        if (existingImageUrl) {
          await uploadService.deleteFileByUrl(existingImageUrl);
        }
        const uploadedFile = await uploadService.processUploadedFile(file);
        imageData[localImageField] = uploadedFile.url;
      }

      const convertedData = convertDates({ ...data, ...imageData }, dateFields);

      return (tx as any)[config.modelName].update({
        where: { id },
        data: convertedData,
      });
    });
  }

  async function remove(id: string) {
    return prisma.$transaction(async (tx) => {
      const item = await (tx as any)[config.modelName].findUnique({ where: { id } });
      if (!item) {
        throw createError(notFoundMessage || `${config.modelName} not found`, 404);
      }

      if (localImageField && (item as any)[localImageField]) {
        await uploadService.deleteFileByUrl((item as any)[localImageField]);
      }

      return (tx as any)[config.modelName].delete({ where: { id } });
    });
  }

  return { findAll, findById, create, update, remove };
}

export type CrudService = ReturnType<typeof createCrudService>;
