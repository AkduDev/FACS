import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { errorHandler } from "./middleware/errorHandler.js";
import galleryRoutes from "./routes/gallery.routes.js";
import newsRoutes from "./routes/news.routes.js";
import eventsRoutes from "./routes/events.routes.js";
import instructorsRoutes from "./routes/instructors.routes.js";
import graduatesRoutes from "./routes/graduates.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files - Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/instructors", instructorsRoutes);
app.use("/api/graduates", graduatesRoutes);
app.use("/api/uploads", uploadRoutes);

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler for unknown routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`FCAS API Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${path.join(process.cwd(), "uploads")}`);
});
