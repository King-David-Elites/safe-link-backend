import { Relations } from '.';
import { ISubscriptionPlan } from './subscription.interface';

export interface IAuth {
  email: string;
  verifyPassword(password: string): boolean;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  _id: string;
}

export enum ITokenTypes {
  passwordResetToken = 'passwordResetToken',
  accountVerificationToken = 'accountVerificationToken',
}

export interface IToken {
  value: string;
  type: ITokenTypes;
  createdAt: Date;
  expireAt: Date;
  email: string;
  _id: string;
}

export interface IUser {
  _id: string;
  email: string;
  name: string;
  about: string;
  profilePicture: string;
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
}
 