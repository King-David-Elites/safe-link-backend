import type { Request, Response, NextFunction } from "express";

const ping = async (req: Request, res: Response, next: NextFunction) => {
  const date = new Date();
  try {
    res
      .status(200)
      .json({ message: `pinged successfully at ${date.getTime()}` });
  } catch (error) {
    return next(error);
  }
};

const pingController = {
  ping,
};

export default pingController;
