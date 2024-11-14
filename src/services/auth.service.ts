import { randomBytes, randomUUID } from "crypto";
import { BadRequestError, NotFoundError } from "../constants/errors";
import sendMail from "../helpers/mailer";
import { IAuth, ITokenTypes, IUser } from "../interfaces/models/user.interface";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import { verifyEmailHTML } from "../templates/verifyEmail";
import tokenService from "./token.service";
import JWTHelper from "../helpers/jwt";
import { LoginRes } from "../interfaces/responses/auth.response";
import { resetPasswordHTML } from "../templates/requestPasswordEmail";
import userService from "./user.service";
import argon2 from "argon2";
import PlanModel from "../models/plans.model";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import UserSubscriptionModel from "../models/user.subscription.model";
import Token from "../models/user.token.model";
import { v4 } from "uuid";

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
  const { email, password, confirmPassword, username } = body;

  if (password != confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }

  const authInDb = await Auth.findOne({ email });

  if (authInDb)
    throw new BadRequestError("User with this email already exists");

  const auth = await Auth.create({ email, password });

  const freemium = await PlanModel.findOne({ name: PlansEnum.FREE });

  const user = await User.create({
    email,
    username,
  });

  await UserSubscriptionModel.create({
    user: user._id,
    plan: freemium?._id,
    isActive: true,
  });

  const token = await tokenService.createToken({
    email,
    type: ITokenTypes.accountVerificationToken,
    value: v4(),
  });

  await sendMail({
    to: email,
    subject: "SAFELINK ACCOUNT VERIFICATION",
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

  await tokenService.deleteToken({ _id: tokenInDb._id });
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

const requestForgotPasswordLink = async (email: string) => {
  /**
   * Request their email
   * Check if there's already a token attached to their email, if yes update it, if not create a new one and send them the link
   */

  const user = await userService.getByEmail(email);

  if (user) {
    const newToken = await tokenService.upsertToken({
      email,
      type: ITokenTypes.passwordResetToken,
      value: randomBytes(32).toString("hex"),
    });

    await sendMail({
      to: email,
      subject: "Forgot Password Verification Link",
      html: resetPasswordHTML(user, newToken.value),
    });
  } else {
    throw new NotFoundError("User with this email does not exist");
  }
};

const resetPassword = async (token: string, body: Partial<IAuth>) => {
  const { password, confirmPassword } = body;

  if (password !== confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }

  /**
   * Get the user from the token and update their password
   */

  const tokenInDb = await tokenService.getToken({
    value: token,
    type: ITokenTypes.passwordResetToken,
  });

  if (!tokenInDb) {
    throw new NotFoundError(
      "Token does not exist or has expired, kindly request the link again"
    );
  }

  const newPassword = await argon2.hash(password as string);

  await Auth.findOneAndUpdate(
    { email: tokenInDb.email },
    { password: newPassword }
  );

  await tokenService.deleteToken({ _id: tokenInDb._id });
};

const authWithGoogle = async (access_token: string) => {};

const authService = {
  getById,
  getByEmail,
  createAccount,
  verifyAccount,
  login,
  requestForgotPasswordLink,
  resetPassword,
};

export default authService;
