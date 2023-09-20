import { IUser } from "../models/user.interface";

export interface LoginRes {
  user: IUser;
  accessToken: string;
}
