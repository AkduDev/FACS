import { Router } from "express";
import * as graduatesController from "../controllers/graduates.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { graduateCreateSchema, graduateUpdateSchema, graduateSearchSchema } from "../validators/graduates.validator.js";
import { z } from "zod";

const router = Router();

const codeParamSchema = z.object({
  code: z.string().min(1).max(50),
});
const idParamSchema = z.object({
  id: z.string().min(1),
});

router.get("/", graduatesController.getAll);
router.get("/search", validate(graduateSearchSchema, "query"), graduatesController.search);
router.get("/verify/:code", validate(codeParamSchema, "params"), graduatesController.verify);
router.get("/:id", validate(idParamSchema, "params"), graduatesController.getById);
router.post("/", authMiddleware, validate(graduateCreateSchema), graduatesController.create);
router.put("/:id", authMiddleware, validate(idParamSchema, "params"), validate(graduateUpdateSchema), graduatesController.update);
router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), graduatesController.remove);

export default router;
