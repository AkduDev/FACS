import { Request, Response, NextFunction } from "express";
import * as graduatesService from "../services/graduates.service.js";

export async function getAll(_req: Request, res: Response, next: NextFunction) {
  try {
    const items = await graduatesService.findAll();
    res.json(items);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await graduatesService.findById(req.params.id);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

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

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await graduatesService.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await graduatesService.update(req.params.id, req.body);
    res.json(item);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await graduatesService.remove(req.params.id);
    res.json({ success: true, id: req.params.id });
  } catch (error) {
    next(error);
  }
}
