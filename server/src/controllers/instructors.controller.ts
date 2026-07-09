import { createCrudController } from "../lib/crud.factory.js";
import * as instructorsService from "../services/instructors.service.js";

export const { getAll, getById, create, update, remove } =
  createCrudController({ service: instructorsService, hasFileUpload: true });
