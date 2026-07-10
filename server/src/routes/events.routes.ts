import { createCrudRoutes } from "../lib/crud.factory.js";
import * as eventsController from "../controllers/events.controller.js";
import { eventCreateSchema, eventUpdateSchema } from "../validators/events.validator.js";

export default createCrudRoutes({
  controller: eventsController,
  createSchema: eventCreateSchema,
  updateSchema: eventUpdateSchema,
  hasFileUpload: false,
});
