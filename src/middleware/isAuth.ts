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
      return res.status(401).json({
        success: false,
        message: "Provide auth token in this format `Bearer ${token}`",
      });
      // throw new UnAuthenticatedError(
      //   "Provide auth token in this format `Bearer ${token}`"
      // );
    }

    const token = await authHeader.split(" ")[1];

    if (!token) {
      // throw new UnAuthenticatedError("Provide token");
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    const userToken = await JWTHelper.verifyJWT<{ userId: string }>(token);

    if (!userToken) {
      // throw new UnAuthenticatedError("Token does not exist or has expired");
      return res.status(401).json({
        success: false,
        message: "Token does not exist or has expired",
      });
    }

    // const userAuth = await authService.getById(userToken.userId);

    const user = await userService.getById(userToken.userId);
    // console.log("user from token", user);

    req.userId = user._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
    // return next(error);
  }
};

export default isAuth;
