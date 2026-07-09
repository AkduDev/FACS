import { prisma } from "../lib/prisma.js";
import { comparePassword, signToken } from "../lib/auth.js";
import { createError } from "../middleware/errorHandler.js";

export async function login(username: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!user) {
    throw createError("Invalid credentials", 401);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw createError("Invalid credentials", 401);
  }

  const token = signToken({
    userId: user.id,
    username: user.username,
  });

  return {
    token,
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    user: {
      id: user.id,
      username: user.username,
    },
  };
}
