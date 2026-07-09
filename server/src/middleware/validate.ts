import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type RequestSource = "body" | "params" | "query";

export function validate(
  schema: ZodSchema,
  source: RequestSource = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = req[source];
      schema.parse(data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.status(400).json({
          error: "Validation failed",
          details: messages,
        });
        return;
      }
      next(error);
    }
  };
}
