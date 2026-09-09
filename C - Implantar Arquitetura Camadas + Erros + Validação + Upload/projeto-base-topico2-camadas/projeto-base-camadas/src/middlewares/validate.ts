/**
 * ============================================================
 * TODO 11 (Encontro 2) -- Middleware de validacao genérico
 * ============================================================
 * So depois do TODO 10 (schema) e do TODO 8 (BadRequestError).
 *
 * function validate(schema) {
 *   return (req, res, next) => {
 *     const result = schema.safeParse(req.body);
 *     if (!result.success) throw new BadRequestError(..., result.error.flatten().fieldErrors);
 *     req.body = result.data;
 *     next();
 *   };
 * }
 * ============================================================
 */

import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "../errors/HttpError";
import { ZodSchema } from "zod";


export function validate(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);
        if (!result.success){
            throw new BadRequestError("dados inválidos", result.error.flatten().fieldErrors)
        } 
        req.body = result.data;
        next();
    }
}