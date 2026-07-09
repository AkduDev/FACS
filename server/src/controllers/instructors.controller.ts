import { Request, Response, NextFunction } from "express";
import * as instructorsService from "../services/instructors.service.js";

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await instructorsService.findAll();
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await instructorsService.findById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const item = await instructorsService.create(req.body, file);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const file = req.file as Express.Multer.File | undefined;
    const item = await instructorsService.update(req.params.id, req.body, file);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await instructorsService.remove(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    next(error);
  }
}
