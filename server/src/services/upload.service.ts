import fs from "fs/promises";
import path from "path";
import { createError } from "../middleware/errorHandler.js";

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

// Configuración por defecto
const DEFAULT_OPTIONS: FileUploadOptions = {
  subfolder: "images",
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"],
  maxSize: 10 * 1024 * 1024, // 10 MB
};

export class UploadService {
  private baseUploadPath: string;

  constructor() {
    this.baseUploadPath = path.join(process.cwd(), "uploads");
  }

  /**
   * Procesa un archivo subido y retorna la información del archivo
   */
  async processUploadedFile(
    file: Express.Multer.File,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    const opts = { ...DEFAULT_OPTIONS, ...options };

    // Validar tipo de archivo
    if (opts.allowedTypes && !opts.allowedTypes.includes(file.mimetype)) {
      // Eliminar archivo si fue guardado por multer
      await this.deleteFile(file.path);
      throw createError(
        `Tipo de archivo no permitido: ${file.mimetype}`,
        400
      );
    }

    // Validar tamaño
    if (opts.maxSize && file.size > opts.maxSize) {
      await this.deleteFile(file.path);
      throw createError(
        `Archivo excede el tamaño máximo: ${(opts.maxSize / 1024 / 1024).toFixed(1)}MB`,
        400
      );
    }

    // Construir URL relativa
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

  /**
   * Procesa múltiples archivos subidos
   */
  async processUploadedFiles(
    files: Express.Multer.File[],
    options: FileUploadOptions = {}
  ): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];

    for (const file of files) {
      try {
        const result = await this.processUploadedFile(file, options);
        results.push(result);
      } catch (error) {
        // Si un archivo falla, eliminamos los ya procesados
        for (const processed of results) {
          await this.deleteFile(processed.path);
        }
        throw error;
      }
    }

    return results;
  }

  /**
   * Elimina un archivo del sistema
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }

  /**
   * Elimina un archivo por su URL
   */
  async deleteFileByUrl(fileUrl: string): Promise<void> {
    // Convertir URL a ruta del sistema
    const relativePath = fileUrl.replace("/uploads/", "");
    const fullPath = path.join(this.baseUploadPath, relativePath);
    await this.deleteFile(fullPath);
  }

  /**
   * Verifica si un archivo existe
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene información de un archivo
   */
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

  /**
   * Limpia archivos huérfanos (opcional, para mantenimiento)
   */
  async cleanupOrphanedFiles(validUrls: string[]): Promise<number> {
    let cleanedCount = 0;

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

    await cleanupDir(this.baseUploadPath);
    return cleanedCount;
  }
}

// Instancia singleton
export const uploadService = new UploadService();
