import { Request, Response, NextFunction } from "express";
import { HttpError } from "http-errors";
import { v4 as uuidv4 } from "uuid";
import logger from "../../logger";
 

export const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction // ✅ Required for Express error-handling middleware
) => {
  const errorId = uuidv4();
  const statusCode = Number(err.statusCode) || 500;
  const isProduction = process.env.NODE_ENV === "production";

  const errorMessage = isProduction ? "Internal server error" : err.message;

  logger.error(`Error ${errorId}: ${err.message}`, {
    id: errorId,
    statusCode,
    error: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    errors: [
      {
        ref: errorId,
        name: err.name || "Error",
        message: errorMessage,
        path: req.path,
        method: req.method,
        location: "server",
        stack: isProduction ? null : err.stack || "No stack available",
      },
    ],
  });
};
