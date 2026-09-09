/**
 * ============================================================
 * TODO 9 (Encontro 2) -- Middleware central de erro
 * ============================================================
 * So depois do TODO 8 (HttpError) estar pronto.
 *
 * Um unico middleware de 4 argumentos (err, req, res, next) que:
 *   - se err for HttpError -> res.status(err.statusCode).json({ error: {...} })
 *   - senao -> console.error(err) + res.status(500).json({ error: {...} })
 *
 * Registre em server.ts com app.use(errorHandler) -- DEPOIS de
 * todas as rotas (veja o TODO 9 la no final de server.ts).
 * ============================================================
 */

import { Request, Response, NextFunction } from "express";
import { HttpError } from "../errors/HttpError";

export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
        return res.status(err.statusCode).json({
            error: {
                message: err.message,
                statusCode: err.statusCode,
                details: err.details ?? null,
            },
        });
    }
    console.error(err);

    return res.status(500).json({
        error: {
            message: "internal server error",
            statusCode: 500,
            details: null,
        },
    });
}