import { NextFunction, Request, Response } from "express";
import { UnAuthenticatedError } from "../constants/errors";
import JWTHelper from "../helpers/jwt";
import authService from "../services/auth.service";
import userService from "../services/user.service";
import { IRequest } from "../interfaces/expressRequest";

const isAuth = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnAuthenticatedError(
        "Provide auth token in this format `Bearer ${token}`"
      );
    }

    const token = await authHeader.split(" ")[1];

    if (!token) {
      throw new UnAuthenticatedError("Provide token");
    }

    const userToken = await JWTHelper.verifyJWT<{ userId: string }>(token);

    if (!userToken) {
      throw new UnAuthenticatedError("Token does not exist or has expired");
    }

    const userAuth = await authService.getById(userToken.userId);

    const user = await userService.getByEmail(userAuth.email);

    req.userId = user._id;

    next();
  } catch (error) {
    return next(error);
  }
};

export default isAuth;
