import { Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IInventory {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  videos: string[];
  currency: string;
  owner: string | Types.ObjectId | IUser;
}
