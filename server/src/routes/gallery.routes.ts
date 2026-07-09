import { Router } from "express";
import * as galleryController from "../controllers/gallery.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { galleryCreateSchema, galleryUpdateSchema } from "../validators/gallery.validator.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = Router();

router.get("/", galleryController.getAll);
router.get("/:id", galleryController.getById);
router.post(
  "/",
  authMiddleware,
  uploadSingleImage,
  validate(galleryCreateSchema),
  galleryController.create
);
router.put(
  "/:id",
  authMiddleware,
  uploadSingleImage,
  validate(galleryUpdateSchema),
  galleryController.update
);
router.delete("/:id", authMiddleware, galleryController.remove);

export default router;
