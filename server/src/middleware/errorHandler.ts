import { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (statusCode >= 500) {
    console.error(`[Error] ${statusCode}: ${message}`);
    console.error(err.stack);
  }

  const isProduction = process.env.NODE_ENV === "production";

  res.status(statusCode).json({
    error: message,
    ...(!isProduction && { stack: err.stack }),
  });
}
