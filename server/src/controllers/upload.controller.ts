import { Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { uploadService } from "../services/upload.service.js";
import { createError } from "../middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SERVER_ROOT = path.join(__dirname, "..", "..");

function sanitizeFilename(filename: string): string {
  const basename = path.basename(filename);
  if (basename !== filename || basename === ".." || basename === ".") {
    throw createError("Invalid filename", 400);
  }
  if (/[<>:"|?*]/.test(basename) || basename.includes("..")) {
    throw createError("Invalid filename characters", 400);
  }
  return basename;
}

function getUploadPath(filename: string): string {
  const safeName = sanitizeFilename(filename);
  return path.join(SERVER_ROOT, "uploads", safeName);
}

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw createError("No file provided", 400);
    }

    const result = await uploadService.processUploadedFile(req.file);

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      file: {
        url: result.url,
        filename: result.filename,
        originalName: result.originalName,
        mimetype: result.mimetype,
        size: result.size,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw createError("No files provided", 400);
    }

    const files = req.files as Express.Multer.File[];
    const results = await uploadService.processUploadedFiles(files);

    res.status(201).json({
      success: true,
      message: `${results.length} image(s) uploaded successfully`,
      files: results.map((r) => ({
        url: r.url,
        filename: r.filename,
        originalName: r.originalName,
        mimetype: r.mimetype,
        size: r.size,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { filename } = req.params;
    if (!filename) {
      throw createError("Filename is required", 400);
    }

    const filePath = getUploadPath(filename);
    const exists = await uploadService.fileExists(filePath);

    if (!exists) {
      throw createError("File not found", 404);
    }

    await uploadService.deleteFile(filePath);

    res.json({
      success: true,
      message: "File deleted successfully",
      filename: sanitizeFilename(filename),
    });
  } catch (error) {
    next(error);
  }
}

export async function checkFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { filename } = req.params;
    if (!filename) {
      throw createError("Filename is required", 400);
    }

    const filePath = getUploadPath(filename);
    const exists = await uploadService.fileExists(filePath);

    let fileInfo = null;
    if (exists) {
      fileInfo = await uploadService.getFileInfo(filePath);
    }

    res.json({
      exists,
      filename: sanitizeFilename(filename),
      ...(fileInfo && {
        size: fileInfo.size,
        created: fileInfo.created,
      }),
    });
  } catch (error) {
    next(error);
  }
}
