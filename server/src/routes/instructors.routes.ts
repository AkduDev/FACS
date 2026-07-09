import { createCrudRoutes } from "../lib/crud.factory.js";
import * as instructorsController from "../controllers/instructors.controller.js";
import { instructorCreateSchema, instructorUpdateSchema } from "../validators/instructors.validator.js";

export default createCrudRoutes({
  controller: instructorsController,
  createSchema: instructorCreateSchema,
  updateSchema: instructorUpdateSchema,
  hasFileUpload: true,
});
