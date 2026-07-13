import { prisma } from "../lib/prisma.js";
import { comparePassword, signToken, verifyToken } from "../lib/auth.js";
import { createError } from "../middleware/errorHandler.js";

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

async function checkBruteForce(username: string): Promise<void> {
  const record = await prisma.rateLimit.findUnique({
    where: { key: username },
  });

  if (record) {
    if (new Date() < record.resetAt) {
      if (record.attempts >= MAX_ATTEMPTS) {
        throw createError("Demasiados intentos fallidos. Espere 15 minutos.", 429);
      }
    } else {
      await prisma.rateLimit.delete({ where: { key: username } });
    }
  }
}

async function recordFailedAttempt(username: string): Promise<void> {
  const record = await prisma.rateLimit.findUnique({
    where: { key: username },
  });

  if (record && new Date() < record.resetAt) {
    await prisma.rateLimit.update({
      where: { key: username },
      data: { attempts: record.attempts + 1 },
    });
  } else {
    await prisma.rateLimit.upsert({
      where: { key: username },
      update: { attempts: 1, resetAt: new Date(Date.now() + LOCKOUT_MS) },
      create: { key: username, attempts: 1, resetAt: new Date(Date.now() + LOCKOUT_MS) },
    });
  }
}

async function clearFailedAttempts(username: string): Promise<void> {
  await prisma.rateLimit.deleteMany({ where: { key: username } });
}

export async function login(username: string, password: string) {
  await checkBruteForce(username);

  const user = await prisma.adminUser.findUnique({
    where: { username },
  });

  if (!user) {
    await recordFailedAttempt(username);
    throw createError("Credenciales inválidas", 401);
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    await recordFailedAttempt(username);
    throw createError("Credenciales inválidas", 401);
  }

  await clearFailedAttempts(username);

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

export async function refreshToken(token: string) {
  try {
    const decoded = verifyToken(token);
    const user = await prisma.adminUser.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      throw createError("Usuario no encontrado", 401);
    }

    const newToken = signToken({
      userId: user.id,
      username: user.username,
    });

    return {
      token: newToken,
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    };
  } catch {
    throw createError("Token inválido o expirado", 401);
  }
}
