import { Router } from "express";
import { cacheControl } from "../middleware/cacheControl.js";
import galleryRoutes from "./gallery.routes.js";
import newsRoutes from "./news.routes.js";
import eventsRoutes from "./events.routes.js";
import instructorsRoutes from "./instructors.routes.js";
import graduatesRoutes from "./graduates.routes.js";
import authRoutes from "./auth.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

// Rutas CRUD con cache público
router.use("/gallery", cacheControl("5m"), galleryRoutes);
router.use("/news", cacheControl("5m"), newsRoutes);
router.use("/events", cacheControl("5m"), eventsRoutes);
router.use("/instructors", cacheControl("10m"), instructorsRoutes);
router.use("/graduates", cacheControl("10m"), graduatesRoutes);

// Rutas de autenticación y uploads
router.use("/auth", authRoutes);
router.use("/uploads", uploadRoutes);

export default router;
