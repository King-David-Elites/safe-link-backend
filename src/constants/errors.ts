import { CustomError } from "../handlers/error.handlers";

export class NotFoundError extends CustomError {
  message: string;

  constructor(message: string) {
    super(404, message);
    this.message = message;
    this.name = "NotFoundError";
  }
}

export class UnAuthenticatedError extends CustomError {
  message: string;

  constructor(message: string) {
    super(401, message);
    this.message = message;
    this.name = "UnAuthenticatedError";
  }
}

export class BadRequestError extends CustomError {
  message: string;

  constructor(message: string) {
    super(400, message);
    this.message = message;
    this.name = "BadRequestError";
  }
}

export class ForbiddenError extends CustomError {
  message: string;

  constructor(message: string) {
    super(403, message);
    this.message = message;
    this.name = "ForbiddenError";
  }
}
