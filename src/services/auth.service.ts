import { randomUUID } from "crypto";
import { BadRequestError, NotFoundError } from "../constants/errors";
import sendMail from "../helpers/mailer";
import { IAuth, ITokenTypes, IUser } from "../interfaces/models/user.interface";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import { verifyEmailHTML } from "../templates/emails";
import tokenService from "./token.service";
import JWTHelper from "../helpers/jwt";
import { LoginRes } from "../interfaces/responses/auth.response";

const getById = async (id: string): Promise<IAuth> => {
  const auth = await Auth.findById(id);

  if (!auth) {
    throw new NotFoundError("auth does not exist");
  }

  return auth;
};

const getByEmail = async (email: string): Promise<IAuth> => {
  const auth = await Auth.findOne({ email });

  if (!auth) {
    throw new NotFoundError("auth does not exist");
  }

  return auth;
};

const createAccount = async (body: Partial<IUser & IAuth>) => {
  const {
    email,
    firstName,
    lastName,
    // about,
    // websiteUrl,
    // facebookUrl,
    // profilePicture,
    // professionalPictures,
    // workPictures,
    // leisurePictures,
    // address,
    // state,
    // city,
    // zipCode,
    phoneNumber1,
    // phoneNumber2,
    // instagramUrl,
    // country,
    password,
    confirmPassword,
  } = body;

  if (password != confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }

  const auth = await Auth.create({ email, password });

  const user = await User.create({
    email,
    firstName,
    lastName,
    // about,
    // websiteUrl,
    // facebookUrl,
    // instagramUrl,
    // profilePicture,
    // professionalPictures,
    // workPictures,
    // leisurePictures,
    // address,
    // country,
    // state,
    // city,
    // zipCode,
    phoneNumber1,
    // phoneNumber2,
  });

  const token = await tokenService.createToken({
    email,
    type: ITokenTypes.accountVerificationToken,
  });

  await sendMail({
    to: email,
    subject: "CREAM CARD ACCOUNT VERIFICATION",
    html: verifyEmailHTML(user, token.value),
  });
};

const verifyAccount = async (token: string) => {
  const tokenInDb = await tokenService.getToken({
    value: token,
    type: ITokenTypes.accountVerificationToken,
  });

  if (!tokenInDb) {
    throw new BadRequestError("Token does not exist or has expired.");
  }

  const auth = await Auth.findOne({ email: tokenInDb.email });
  if (!auth) {
    throw new NotFoundError("user with this email does not exist");
  }

  if (auth?.isVerified) {
    throw new BadRequestError("Account is already verified");
  }

  auth.isVerified = true;
  await auth.save();
};

const login = async (body: Partial<IAuth>): Promise<LoginRes> => {
  const { email, password } = body;

  const authInDb = await Auth.findOne({ email });

  if (!authInDb) {
    throw new NotFoundError("User does not exist");
  }

  const user = await User.findOne({ email: authInDb.email });

  if (!authInDb.isVerified) {
    // send another verification email
    const token = randomUUID();
    await tokenService.updateToken(
      { email, type: ITokenTypes.accountVerificationToken },
      token
    );

    await sendMail({
      to: email,
      subject: "Verify Account Before Login",
      html: verifyEmailHTML(user as IUser, token),
    });

    throw new BadRequestError(
      "Your account is not yet verified, kindly check your email for a new verification link"
    );
  }
  const isPasswordMatch = await authInDb.verifyPassword(password as string);

  if (!isPasswordMatch) {
    throw new BadRequestError("Password is incorrect");
  }

  // send access token and user info
  const accessToken = await JWTHelper.signJWT(authInDb._id);

  return {
    accessToken,
    user: user as IUser,
  };
};

const authService = {
  createAccount,
  verifyAccount,
  login,
};

export default authService;
