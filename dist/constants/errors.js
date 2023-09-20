"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.ForbiddenError = exports.BadRequestError = exports.UnAuthenticatedError = exports.NotFoundError = void 0;
const error_handlers_1 = require("../handlers/error.handlers");
class NotFoundError extends error_handlers_1.CustomError {
    constructor(message) {
        super(404, message);
        this.message = message;
        this.name = "NotFoundError";
    }
}
exports.NotFoundError = NotFoundError;
class UnAuthenticatedError extends error_handlers_1.CustomError {
    constructor(message) {
        super(401, message);
        this.message = message;
        this.name = "UnAuthenticatedError";
    }
}
exports.UnAuthenticatedError = UnAuthenticatedError;
class BadRequestError extends error_handlers_1.CustomError {
    constructor(message) {
        super(400, message);
        this.message = message;
        this.name = "BadRequestError";
    }
}
exports.BadRequestError = BadRequestError;
class ForbiddenError extends error_handlers_1.CustomError {
    constructor(message) {
        super(403, message);
        this.message = message;
        this.name = "ForbiddenError";
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends error_handlers_1.CustomError {
    constructor(message) {
        super(500, message);
        this.message = message;
        this.name = "InternalServerError";
    }
}
exports.InternalServerError = InternalServerError;
