import { createCrudController } from "../lib/crud.factory.js";
import * as galleryService from "../services/gallery.service.js";

export const { getAll, getById, create, update, remove } =
  createCrudController({ service: galleryService, hasFileUpload: true });
