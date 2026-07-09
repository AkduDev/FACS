import { createCrudRoutes } from "../lib/crud.factory.js";
import * as newsController from "../controllers/news.controller.js";
import { newsCreateSchema, newsUpdateSchema } from "../validators/news.validator.js";

export default createCrudRoutes({
  controller: newsController,
  createSchema: newsCreateSchema,
  updateSchema: newsUpdateSchema,
  hasFileUpload: true,
});
