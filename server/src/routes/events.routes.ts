import { Router } from "express";
import * as eventsController from "../controllers/events.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { eventCreateSchema, eventUpdateSchema } from "../validators/events.validator.js";
import { uploadSingleImage } from "../middleware/upload.js";

const router = Router();

router.get("/", eventsController.getAll);
router.get("/:id", eventsController.getById);
router.post(
  "/",
  authMiddleware,
  uploadSingleImage,
  validate(eventCreateSchema),
  eventsController.create
);
router.put(
  "/:id",
  authMiddleware,
  uploadSingleImage,
  validate(eventUpdateSchema),
  eventsController.update
);
router.delete("/:id", authMiddleware, eventsController.remove);

export default router;
