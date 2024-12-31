import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwt";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import PlanModel from "../models/plans.model";
import UserSubscriptionModel from "../models/user.subscription.model";
import Influencer from "../models/influencer.model";
import mongoose from "mongoose";
import Referral from "../models/referral.model";

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
      if (referralCode.toLowerCase().startsWith("ref-")) {
        // Look up in Referral model
        const referral = await Referral.findOne({
          referralCode: referralCode.toLowerCase(),
        });
        if (!referral) {
          console.warn("referral not found");
          referredBy = null;
        } else {
          referredBy = referral._id;
        }
      } else {
        // Look up in Influencer model
        const influencer = await Influencer.findOne({
          referralCode: referralCode.toLowerCase(),
        });
        if (!influencer) {
          console.warn("influencer not found");
          referredBy = null;
        } else {
          referredBy = influencer._id;
        }
      }
    }
    user = await User.create({
      email,
      username,
      referredBy,
      isVerified: true,
    });

    const freemium = await PlanModel.findOne({ name: PlansEnum.FREE });
    if (freemium) {
      const existingUserSubscription = await UserSubscriptionModel.findOne({
        user: user._id, // or email-based if user creation hasn't occurred yet
      });

      if (!existingUserSubscription)
        await UserSubscriptionModel.create({
          user: user._id,
          plan: freemium._id,
          isActive: true,
        });
    }
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
