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

const editUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = <string>req.userId;

    const data = await userService.editUser({ ...req.body, _id });

    return res
      .status(200)
      .json({ message: "Profile updated successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getMyInfo = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = <string>req.userId;

    const data = await userService.getById(userId);

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = <string>req.params.email;

    const data = await userService.getByEmail(email);

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = <string>req.params.id;

    const data = await userService.getById(id);

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = <string>req.userId;

    await userService.deleteUser(userId);

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (
  req: Request<{}, {}, {}, { search?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await userService.getUsers(req.query.search);

    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

const userController = {
  changePassword,
  editUser,
  deleteUser,
  getMyInfo,
  getUserByEmail,
  getUserById,
  getUsers,
};

export default userController;