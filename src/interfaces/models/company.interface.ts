import { Types } from "mongoose";
import { IUser } from "./user.interface";

export interface ICompany {
  name: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  email: string;
  alternativeEmail: string;
  phoneNumber1: number;
  phoneNumber2: number;
  coverPicture: string;
  ownedBy: string | Types.ObjectId | IUser;
}
