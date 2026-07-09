import { createCrudRoutes } from "../lib/crud.factory.js";
import * as galleryController from "../controllers/gallery.controller.js";
import { galleryCreateSchema, galleryUpdateSchema } from "../validators/gallery.validator.js";

export default createCrudRoutes({
  controller: galleryController,
  createSchema: galleryCreateSchema,
  updateSchema: galleryUpdateSchema,
  hasFileUpload: true,
});
