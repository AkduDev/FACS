import { PrismaClient } from "@prisma/client";
import { createError } from "../middleware/errorHandler.js";
import { uploadService } from "../services/upload.service.js";
import { prisma } from "./prisma.js";

type PrismaTxClient = Parameters<Parameters<PrismaClient["$transaction"]>[0]>[0];

// Prisma model delegates have complex generic signatures that resist
// clean abstraction. We use a minimal structural type for the 6 methods
// we actually call. The `any` is confined to this single interface.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface CrudModelDelegate {
  findMany: (...args: any[]) => Promise<unknown[]>;
  findUnique: (...args: any[]) => Promise<unknown>;
  create: (...args: any[]) => Promise<unknown>;
  update: (...args: any[]) => Promise<unknown>;
  delete: (...args: any[]) => Promise<unknown>;
  count: (...args: any[]) => Promise<number>;
}

export interface CrudServiceConfig {
  modelName: string;
  orderBy?: Record<string, string>;
  localImageField?: string;
  dateFields?: string[];
  notFoundMessage?: string;
  selectFields?: string[];
  maxLimit?: number;
}

function convertDates<T extends Record<string, unknown>>(data: T, dateFields: string[]): T {
  const converted = { ...data };
  for (const field of dateFields) {
    if (converted[field] && typeof converted[field] === "string") {
      (converted as Record<string, unknown>)[field] = new Date(converted[field] as string);
    }
  }
  return converted;
}

function getModelFromTx(tx: PrismaTxClient, modelName: string): CrudModelDelegate {
  const camelCase = modelName.charAt(0).toLowerCase() + modelName.slice(1);
  return (tx as unknown as Record<string, CrudModelDelegate>)[camelCase];
}

export function createCrudService(
  prismaModel: CrudModelDelegate,
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
        ...(selectObj ? { select: selectObj } : {}),
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

  async function create(data: Record<string, unknown>, file?: Express.Multer.File) {
    const imageData: Record<string, unknown> = {};

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
    data: Record<string, unknown>,
    file?: Express.Multer.File
  ) {
    return prisma.$transaction(async (tx) => {
      const txModel = getModelFromTx(tx, config.modelName);
      const existingItem = await txModel.findUnique({ where: { id } });
      if (!existingItem) {
        throw createError(notFoundMessage || `${config.modelName} not found`, 404);
      }

      const imageData: Record<string, unknown> = {};
      if (file && localImageField) {
        const existingRecord = existingItem as Record<string, unknown>;
        const existingImageUrl = existingRecord[localImageField];
        if (existingImageUrl && typeof existingImageUrl === "string") {
          await uploadService.deleteFileByUrl(existingImageUrl);
        }
        const uploadedFile = await uploadService.processUploadedFile(file);
        imageData[localImageField] = uploadedFile.url;
      }

      const convertedData = convertDates({ ...data, ...imageData }, dateFields);

      return txModel.update({
        where: { id },
        data: convertedData,
      });
    });
  }

  async function remove(id: string) {
    return prisma.$transaction(async (tx) => {
      const txModel = getModelFromTx(tx, config.modelName);
      const item = await txModel.findUnique({ where: { id } });
      if (!item) {
        throw createError(notFoundMessage || `${config.modelName} not found`, 404);
      }

      if (localImageField) {
        const record = item as Record<string, unknown>;
        const imageUrl = record[localImageField];
        if (imageUrl && typeof imageUrl === "string") {
          await uploadService.deleteFileByUrl(imageUrl);
        }
      }

      return txModel.delete({ where: { id } });
    });
  }

  return { findAll, findById, create, update, remove };
}

export type CrudService = ReturnType<typeof createCrudService>;
