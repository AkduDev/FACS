import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createError } from "../middleware/errorHandler.js";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw createError("JWT_SECRET environment variable is required", 500);
  }
  return secret;
}

function getJwtExpiresIn(): string | number {
  const val = process.env.JWT_EXPIRES_IN || "24h";
  const num = parseInt(val, 10);
  if (!isNaN(num) && val.endsWith("s")) return num;
  if (!isNaN(num) && val.endsWith("h")) return num * 3600;
  if (!isNaN(num) && val.endsWith("d")) return num * 86400;
  return val;
}

export interface JwtPayload {
  userId: string;
  username: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: getJwtExpiresIn() as any });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}
