import { Request, Response, NextFunction } from "express";
import { uploadService } from "../services/upload.service.js";
import { createError } from "../middleware/errorHandler.js";

/**
 * POST /api/uploads/image
 * Sube una imagen individual
 */
export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.file) {
      throw createError("No se proporcionó ningún archivo", 400);
    }

    const result = await uploadService.processUploadedFile(req.file);

    res.status(201).json({
      success: true,
      message: "Imagen subida correctamente",
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

/**
 * POST /api/uploads/images
 * Sube múltiples imágenes
 */
export async function uploadImages(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      throw createError("No se proporcionaron archivos", 400);
    }

    const files = req.files as Express.Multer.File[];
    const results = await uploadService.processUploadedFiles(files);

    res.status(201).json({
      success: true,
      message: `${results.length} imagen(es) subida(s) correctamente`,
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

/**
 * DELETE /api/uploads/:filename
 * Elimina un archivo por su nombre
 */
export async function deleteFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { filename } = req.params;

    if (!filename) {
      throw createError("Se requiere el nombre del archivo", 400);
    }

    // Buscar el archivo en ambos directorios
    const imagesPath = `${process.cwd()}/uploads/images/${filename}`;
    const documentsPath = `${process.cwd()}/uploads/documents/${filename}`;

    const imagesExist = await uploadService.fileExists(imagesPath);
    const documentsExist = await uploadService.fileExists(documentsPath);

    if (!imagesExist && !documentsExist) {
      throw createError("Archivo no encontrado", 404);
    }

    const filePath = imagesExist ? imagesPath : documentsPath;
    await uploadService.deleteFile(filePath);

    res.json({
      success: true,
      message: "Archivo eliminado correctamente",
      filename,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/uploads/check/:filename
 * Verifica si un archivo existe
 */
export async function checkFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { filename } = req.params;

    const imagesPath = `${process.cwd()}/uploads/images/${filename}`;
    const documentsPath = `${process.cwd()}/uploads/documents/${filename}`;

    const imagesExist = await uploadService.fileExists(imagesPath);
    const documentsExist = await uploadService.fileExists(documentsPath);

    const exists = imagesExist || documentsExist;
    const filePath = imagesExist ? imagesPath : documentsPath;

    let fileInfo = null;
    if (exists) {
      fileInfo = await uploadService.getFileInfo(filePath);
    }

    res.json({
      exists,
      filename,
      ...(fileInfo && {
        size: fileInfo.size,
        created: fileInfo.created,
      }),
    });
  } catch (error) {
    next(error);
  }
}
