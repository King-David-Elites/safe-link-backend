export interface IAuth {
  email: string;
  verifyPassword(password: string): boolean;
  password: string;
  confirmPassword: string;
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

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  about: string;
  websiteUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  profilePicture: string;
  professionalPictures: string[];
  workPictures: string[];
  leisurePictures: string[];
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  phoneNumber1: number;
  phoneNumber2: number;
}
