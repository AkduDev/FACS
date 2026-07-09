import { Router } from "express";
import * as graduatesController from "../controllers/graduates.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { graduateCreateSchema, graduateUpdateSchema } from "../validators/graduates.validator.js";

const router = Router();

router.get("/", graduatesController.getAll);
router.get("/search", graduatesController.search);
router.get("/verify/:code", graduatesController.verify);
router.get("/:id", graduatesController.getById);
router.post("/", authMiddleware, validate(graduateCreateSchema), graduatesController.create);
router.put("/:id", authMiddleware, validate(graduateUpdateSchema), graduatesController.update);
router.delete("/:id", authMiddleware, graduatesController.remove);

export default router;
