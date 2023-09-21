import express, { Request, Response, NextFunction } from "express";

export class CustomError extends Error {
  code: number;
  message: string;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;
  }
}

export const errorHandler = (
  error: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  if (error instanceof CustomError) {
    return res.status(error.code).json({ error: error.message });
  }

  res.status(500).json({ error: error.message });
};

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Route does not exist" });
};
