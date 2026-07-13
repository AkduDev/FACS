import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createError } from "../middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SERVER_ROOT = path.join(__dirname, "..", "..");

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
}

export interface FileUploadOptions {
  subfolder?: string;
  allowedTypes?: string[];
  maxSize?: number;
}

const DEFAULT_OPTIONS: FileUploadOptions = {
  subfolder: "images",
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  maxSize: 10 * 1024 * 1024,
};

export class UploadService {
  private baseUploadPath: string;

  constructor() {
    this.baseUploadPath = path.join(SERVER_ROOT, "uploads");
  }

  async processUploadedFile(
    file: Express.Multer.File,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    if (opts.allowedTypes && !opts.allowedTypes.includes(file.mimetype)) {
      await this.deleteFile(file.path);
      throw createError(
        `File type not allowed: ${file.mimetype}`,
        400
      );
    }

    if (opts.maxSize && file.size > opts.maxSize) {
      await this.deleteFile(file.path);
      throw createError(
        `File exceeds max size: ${(opts.maxSize / 1024 / 1024).toFixed(1)}MB`,
        400
      );
    }

    const relativePath = path.relative(this.baseUploadPath, file.path);
    const url = `/uploads/${relativePath.replace(/\\/g, "/")}`;

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url,
    };
  }

  async processUploadedFiles(
    files: Express.Multer.File[],
    options: FileUploadOptions = {}
  ): Promise<UploadedFile[]> {
    const results = await Promise.all(
      files.map((file) => this.processUploadedFile(file, options))
    );
    return results;
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    }
  }

  async deleteFileByUrl(fileUrl: string): Promise<void> {
    const relativePath = fileUrl.replace("/uploads/", "");
    const fullPath = path.join(this.baseUploadPath, relativePath);
    await this.deleteFile(fullPath);
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async getFileInfo(filePath: string): Promise<{
    exists: boolean;
    size?: number;
    created?: Date;
  }> {
    try {
      const stats = await fs.stat(filePath);
      return {
        exists: true,
        size: stats.size,
        created: stats.birthtime,
      };
    } catch {
      return { exists: false };
    }
  }

  async cleanupOrphanedFiles(validUrls: string[]): Promise<number> {
    let totalCleaned = 0;

    const cleanupDir = async (dirPath: string): Promise<number> => {
      let count = 0;
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = path.join(dirPath, entry.name);

          if (entry.isDirectory()) {
            count += await cleanupDir(fullPath);
          } else {
            const relativePath = path.relative(this.baseUploadPath, fullPath);
            const url = `/uploads/${relativePath.replace(/\\/g, "/")}`;

            if (!validUrls.includes(url)) {
              await this.deleteFile(fullPath);
              count++;
            }
          }
        }
      } catch (error) {
        console.error(`Error cleaning directory ${dirPath}:`, error);
      }
      return count;
    };

    totalCleaned = await cleanupDir(this.baseUploadPath);
    return totalCleaned;
  }
}

export const uploadService = new UploadService();
