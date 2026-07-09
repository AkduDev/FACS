import { Router } from "express";
import * as instructorsController from "../controllers/instructors.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { instructorCreateSchema, instructorUpdateSchema } from "../validators/instructors.validator.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = Router();

router.get("/", instructorsController.getAll);
router.get("/:id", instructorsController.getById);
router.post(
  "/",
  authMiddleware,
  uploadSingleImage,
  validate(instructorCreateSchema),
  instructorsController.create
);
router.put(
  "/:id",
  authMiddleware,
  uploadSingleImage,
  validate(instructorUpdateSchema),
  instructorsController.update
);
router.delete("/:id", authMiddleware, instructorsController.remove);

export default router;
