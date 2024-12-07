import { Types } from "mongoose";
import { Relations } from ".";
import { ISubscriptionPlan } from "./subscription.interface";

export interface IAuth {
  email: string;
  verifyPassword(password: string): boolean;
  password: string;
  confirmPassword: string;
  referralCode?: string;
  isVerified: boolean;
  _id: string;
}

export enum ITokenTypes {
  passwordResetToken = "passwordResetToken",
  accountVerificationToken = "accountVerificationToken",
}

export interface IToken {
  value: string;
  type: ITokenTypes;
  createdAt: Date;
  expireAt: Date;
  email: string;
  _id: string;
}

// Define the subscription status enum
export enum SubscriptionStatus {
  FREE = "free",
  BASIC = "basic",
  PLUS = "premium",
  PLATINUM = "Platinum",
  // Add more subscription statuses as needed
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  about: string;
  profilePicture: string;
  coverPicture: string;
  professionalPictures: string[];
  workPictures: string[];
  leisurePictures: string[];
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  phoneNumber: string;
  otp: string;
  otpExpiresAt?: Date;
  isVerified: boolean;
  subscriptionStatus: SubscriptionStatus;
  isProfileCompleted: boolean;
  formattedUsername: string;
  shareableLink: string;
  referredBy?: Types.ObjectId; // Reference to Influencer _id
}
