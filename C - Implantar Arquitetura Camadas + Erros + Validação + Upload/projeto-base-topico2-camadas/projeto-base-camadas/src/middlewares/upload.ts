/**
 * ============================================================
 * TODO 12 (Encontro 2) -- Configuracao do multer
 * ============================================================
 * multer.diskStorage: destino "uploads/", nome de arquivo GERADO
 * pelo servidor (nunca o nome original do cliente -- e o que
 * previne path traversal).
 *
 * fileFilter: so aceitar image/jpeg e image/png.
 * limits.fileSize: 2 * 1024 * 1024 (2MB).
 *
 * export const uploadPhoto = multer({ storage, limits, fileFilter });
 * ============================================================
 */

import multer from "multer";
import crypto from "node:crypto";
import { Request } from "express";
import { UnprocessableEntityError } from "../errors/HttpError.ts";

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const extension = file.mimetype === "image/png" ? ".png" : ".jpg";
    const uniqueName = crypto.randomUUID();
    cb(null, `${uniqueName}${extension}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new UnprocessableEntityError("Apenas arquivos image/jpeg e image/png sao permitidos."));
  }
};

const limits = {
  fileSize: 2 * 1024 * 1024, 
};

export const uploadPhoto = multer({ storage, limits, fileFilter });