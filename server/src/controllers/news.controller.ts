import { createCrudController } from "../lib/crud.factory.js";
import * as newsService from "../services/news.service.js";

export const { getAll, getById, create, update, remove } =
  createCrudController({ service: newsService, hasFileUpload: true });
