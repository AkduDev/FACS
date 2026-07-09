import { Router } from "express";
import * as uploadController from "../controllers/upload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  uploadSingleImage,
  uploadMultipleImages,
} from "../middleware/upload.js";

const router = Router();

router.post(
  "/image",
  authMiddleware,
  uploadSingleImage,
  uploadController.uploadImage
);

router.post(
  "/images",
  authMiddleware,
  uploadMultipleImages,
  uploadController.uploadImages
);

router.delete(
  "/:filename",
  authMiddleware,
  uploadController.deleteFile
);

router.get(
  "/check/:filename",
  authMiddleware,
  uploadController.checkFile
);

export default router;
