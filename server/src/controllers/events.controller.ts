import { createCrudController } from "../lib/crud.factory.js";
import * as eventsService from "../services/events.service.js";

export const { getAll, getById, create, update, remove } =
  createCrudController({ service: eventsService, hasFileUpload: true });
