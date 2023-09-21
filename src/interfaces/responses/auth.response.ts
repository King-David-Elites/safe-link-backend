import { IUser } from "../models/user.interface";

export interface LoginRes {
  user: IUser;
  accessToken: string;
}

export interface IResetPasswordReq {
  password: string;
  confirmPassword: string;
  token: string;
}

export interface IChangePasswordReq {
  userId: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}
