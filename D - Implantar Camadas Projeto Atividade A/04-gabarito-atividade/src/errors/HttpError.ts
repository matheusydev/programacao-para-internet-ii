export class HttpError extends Error {
    readonly statusCode: number;
    readonly details?: Record<string, unknown>;

    constructor(statusCode: number, message: string, details?: Record<string, unknown>) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends HttpError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(400, message, details);
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(404, message, details);
    }
}

export class ConflictError extends HttpError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(409, message, details);
    }
}

export class UnprocessableEntityError extends HttpError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(422, message, details);
    }
}

export class PayloadTooLargeError extends HttpError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(413, message, details);
    }
}