import { Request, Response, NextFunction } from "express";
import { createCrudController } from "../lib/crud.factory.js";
import * as graduatesService from "../services/graduates.service.js";

const base = createCrudController({
  service: graduatesService,
  hasFileUpload: false,
});

export const { getAll, getById, create, update, remove } = base;

export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      res.status(400).json({ error: "Query parameter 'q' is required" });
      return;
    }
    const items = await graduatesService.search(q);
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const { code } = req.params;
    const item = await graduatesService.findByCertificationCode(code);
    res.json({ valid: true, graduate: item });
  } catch (error) {
    next(error);
  }
}
