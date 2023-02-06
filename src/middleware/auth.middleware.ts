import { NextFunction, Request, Response } from "express";
import { HttpError } from "../types/custom.error";
import authService from "../services/auth.service";
import { JsonWebTokenError } from "jsonwebtoken";

export function authMiddleware(
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      throw new HttpError("Authorization is required", 401);
    }
    const headerSections = header.split(" ");

    if (headerSections[0] !== "Bearer") {
      throw new HttpError("Ivalid token type", 401);
    }

    const isValid = authService.compareToken(headerSections[1]);

    req["user"] = isValid;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        message: "Unauthenticated",
      });
    }
    if (error instanceof HttpError) {
      res.status(401).json({ message: error.message });
    }
  }
}
