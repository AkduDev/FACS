import { Router } from "express";
import * as newsController from "../controllers/news.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { newsCreateSchema, newsUpdateSchema } from "../validators/news.validator.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = Router();

router.get("/", newsController.getAll);
router.get("/:id", newsController.getById);
router.post(
  "/",
  authMiddleware,
  uploadSingleImage,
  validate(newsCreateSchema),
  newsController.create
);
router.put(
  "/:id",
  authMiddleware,
  uploadSingleImage,
  validate(newsUpdateSchema),
  newsController.update
);
router.delete("/:id", authMiddleware, newsController.remove);

export default router;
