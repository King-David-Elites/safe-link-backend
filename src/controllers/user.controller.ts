import { NextFunction, Request, Response } from "express";
import { IChangePasswordReq } from "../interfaces/responses/auth.response";
import userService from "../services/user.service";
import { IRequest } from "../interfaces/expressRequest";

const changePassword = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, oldPassword, confirmNewPassword } = req.body;

  const userId = <string>req.userId;

  try {
    await userService.changePassword({
      userId,
      newPassword,
      oldPassword,
      confirmNewPassword,
    });

    res
      .status(200)
      .json({ message: "Password Changed Successfully", data: null });
  } catch (error) {
    return next(error);
  }
};

const userController = {
  changePassword,
};

export default userController;
