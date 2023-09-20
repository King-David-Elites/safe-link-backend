"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundError = exports.errorHandler = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
exports.CustomError = CustomError;
const errorHandler = (error, req, res, next) => {
    if (error instanceof CustomError) {
        res.status(error.code).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
};
exports.errorHandler = errorHandler;
const notFoundError = (req, res) => {
    res.status(404).json({ error: "Route does not exist" });
};
exports.notFoundError = notFoundError;
