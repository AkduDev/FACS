import { prisma } from "../lib/prisma.js";
import { createCrudService } from "../lib/service.factory.js";

export const {
  findAll,
  findById,
  create,
  update,
  remove,
} = createCrudService(prisma.event, {
  modelName: "Event",
  orderBy: { date: "desc" },
  localImageField: "localImage",
  dateFields: ["date"],
});
