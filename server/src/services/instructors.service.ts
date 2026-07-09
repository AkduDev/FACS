import { prisma } from "../lib/prisma.js";
import { createCrudService } from "../lib/service.factory.js";

export const {
  findAll,
  findById,
  create,
  update,
  remove,
} = createCrudService(prisma.instructor, {
  modelName: "Instructor",
  orderBy: { experienceYears: "desc" },
  localImageField: "localPhoto",
});
