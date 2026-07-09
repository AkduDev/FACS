import { Request, Response, NextFunction } from "express";
import { ZodSchema, z } from "zod";
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { uploadSingleImage } from "../middleware/upload.js";

export interface CrudControllerConfig {
  service: {
    findAll: (options?: { page?: number; limit?: number }) => Promise<any>;
    findById: (id: string) => Promise<any>;
    create: (data: any, file?: Express.Multer.File) => Promise<any>;
    update: (id: string, data: any, file?: Express.Multer.File) => Promise<any>;
    remove: (id: string) => Promise<any>;
  };
  hasFileUpload?: boolean;
}

export function createCrudController(config: CrudControllerConfig) {
  const { service, hasFileUpload = true } = config;

  return {
    async getAll(req: Request, res: Response, next: NextFunction) {
      try {
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
        const result = await service.findAll({ page, limit });
        res.json(result);
      } catch (error) {
        next(error);
      }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await service.findById(req.params.id);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const file = hasFileUpload
          ? (req.file as Express.Multer.File | undefined)
          : undefined;
        const item = await service.create(req.body, file);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    },

    async update(req: Request, res: Response, next: NextFunction) {
      try {
        const file = hasFileUpload
          ? (req.file as Express.Multer.File | undefined)
          : undefined;
        const item = await service.update(req.params.id, req.body, file);
        res.json(item);
      } catch (error) {
        next(error);
      }
    },

    async remove(req: Request, res: Response, next: NextFunction) {
      try {
        await service.remove(req.params.id);
        res.json({ success: true, id: req.params.id });
      } catch (error) {
        next(error);
      }
    },
  };
}

export interface CrudRoutesConfig {
  controller: {
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    getById: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    remove: (req: Request, res: Response, next: NextFunction) => void;
  };
  createSchema: ZodSchema;
  updateSchema: ZodSchema;
  hasFileUpload?: boolean;
}

export function createCrudRoutes(config: CrudRoutesConfig) {
  const { controller, createSchema, updateSchema, hasFileUpload = true } = config;
  const router = Router();

  const idParamSchema = z.object({
    id: z.string().min(1),
  });

  router.get("/", controller.getAll);
  router.get("/:id", validate(idParamSchema, "params"), controller.getById);

  if (hasFileUpload) {
    router.post(
      "/",
      authMiddleware,
      uploadSingleImage,
      validate(createSchema),
      controller.create
    );
    router.put(
      "/:id",
      authMiddleware,
      uploadSingleImage,
      validate(idParamSchema, "params"),
      validate(updateSchema),
      controller.update
    );
  } else {
    router.post(
      "/",
      authMiddleware,
      validate(createSchema),
      controller.create
    );
    router.put(
      "/:id",
      authMiddleware,
      validate(idParamSchema, "params"),
      validate(updateSchema),
      controller.update
    );
  }

  router.delete("/:id", authMiddleware, validate(idParamSchema, "params"), controller.remove);

  return router;
}
