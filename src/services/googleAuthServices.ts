import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwt";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import PlanModel from "../models/plans.model";
import UserSubscriptionModel from "../models/user.subscription.model";
import Influencer from "../models/influencer.model";
import mongoose from "mongoose";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(googleClientId);

const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: googleClientId,
  });
  return ticket.getPayload();
};

const findOrCreateUser = async ({
  email,
  username,
  referralCode,
}: {
  email: string;
  username: string;
  referralCode: string | null;
}) => {
  let user = await User.findOne({ email });
  if (!user) {
    let referredBy: mongoose.Types.ObjectId | null = null;
    if (referralCode) {
      const influencer = await Influencer.findOne({ referralCode });
      if (!influencer) {
        console.warn("influencer not found");
        referredBy = null; // Proceed without referral
      } else {
        referredBy = influencer?._id ?? null;
        console.log({ referredBy });
      }
    }
    user = await User.create({
      email,
      username,
      referredBy,
      isVerified: true,
    });
  }

  const freemium = await PlanModel.findOne({ name: PlansEnum.FREE });
  if (freemium) {
    await UserSubscriptionModel.create({
      user: user._id,
      plan: freemium._id,
      isActive: true,
    });
  }

  return user;
};

const generateJWT = async (userId: string) => {
  const token = await JWTHelper.signJWT(userId);
  return token;
};

const googleAuthService = {
  verifyGoogleToken,
  findOrCreateUser,
  generateJWT,
};

export default googleAuthService;
