import dotenv from "dotenv";
dotenv.config();

import { prisma } from "./lib/prisma.js";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { errorHandler } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET environment variable is required");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(helmet());

// Gzip compression
app.use(compression());

// Request logging
app.use(morgan("combined"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use("/api", limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts, please try again later" },
});
app.use("/api/auth", authLimiter);

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Static files - Serve uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: "connected",
    });
  } catch {
    res.status(503).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
    });
  }
});

// 404 handler for unknown routes
app.use("/api/*", (_req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`FCAS API Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${path.join(process.cwd(), "uploads")}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(async () => {
    await prisma.$disconnect();
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});
