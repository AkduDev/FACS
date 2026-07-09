import { Request, Response, NextFunction } from "express";

export function cacheControl(maxAge: string) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("Cache-Control", `public, max-age=${parseMaxAge(maxAge)}, stale-while-revalidate=300`);
    next();
  };
}

function parseMaxAge(value: string): number {
  const match = value.match(/^(\d+)([smhd])$/);
  if (!match) return 60;
  const num = parseInt(match[1], 10);
  switch (match[2]) {
    case "s": return num;
    case "m": return num * 60;
    case "h": return num * 3600;
    case "d": return num * 86400;
    default: return 60;
  }
}
