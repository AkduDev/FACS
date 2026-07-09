import { Router } from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  uploadSingleImage,
  uploadMultipleImages,
} from "../middleware/upload.js";

const router = Router();

/**
 * POST /api/uploads/image
 * Sube una imagen individual
 * Requiere autenticación JWT
 * Body: multipart/form-data con campo "image"
 */
router.post(
  "/image",
  authMiddleware,
  uploadSingleImage,
  uploadController.uploadImage
);

/**
 * POST /api/uploads/images
 * Sube múltiples imágenes (máximo 5)
 * Requiere autenticación JWT
 * Body: multipart/form-data con campo "images"
 */
router.post(
  "/images",
  authMiddleware,
  uploadMultipleImages,
  uploadController.uploadImages
);

/**
 * DELETE /api/uploads/:filename
 * Elimina un archivo por su nombre
 * Requiere autenticación JWT
 */
router.delete(
  "/:filename",
  authMiddleware,
  uploadController.deleteFile
);

/**
 * GET /api/uploads/check/:filename
 * Verifica si un archivo existe (público)
 */
router.get(
  "/check/:filename",
  uploadController.checkFile
);

export default router;
