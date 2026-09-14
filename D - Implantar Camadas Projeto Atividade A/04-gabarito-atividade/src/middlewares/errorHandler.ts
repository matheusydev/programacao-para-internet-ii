import { Request, Response, NextFunction } from "express";
import { HttpError, PayloadTooLargeError } from "../errors/HttpError";
import multer from "multer";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      const error = new PayloadTooLargeError("O arquivo enviado excede o limite de 2 MB.")

      res.status(error.statusCode).json({
        error: {
          message: error.message, 
          statusCode: error.statusCode, 
          details: error.details ?? null,
        },
      });
      
      return;
    }
  }

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        details: err.details ?? null,
      },
    });
    return;
  }

  console.error("Erro interno não tratado:", err);
  res.status(500).json({
    error: {
      message: "Erro interno do servidor.",
      statusCode: 500,
      details: null,
    },
  });
}