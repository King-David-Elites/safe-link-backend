import { BadRequestError, NotFoundError } from "../constants/errors";
import { IUser } from "../interfaces/models/user.interface";
import { IChangePasswordReq } from "../interfaces/responses/auth.response";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import argon2 from "argon2";

const getById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  return user;
};

const getByEmail = async (email: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  return user;
};

const changePassword = async (body: IChangePasswordReq) => {
  const { userId, confirmNewPassword, newPassword, oldPassword } = body;

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError(
      "New password and confirm new password do not match"
    );
  }

  const user = await userService.getById(userId);

  const userAuth = await Auth.findOne({ email: user.email });

  if (!userAuth) {
    throw new NotFoundError("User does not exist");
  }

  const isPasswordMatch = await userAuth?.verifyPassword(oldPassword);

  if (!isPasswordMatch) {
    throw new BadRequestError("Old password is incorrect");
  }

  const newPasswordHash = await argon2.hash(newPassword);

  userAuth.password = newPasswordHash;

  await userAuth.save();
};

const userService = {
  getById,
  getByEmail,
  changePassword,
};

export default userService;
