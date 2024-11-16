import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import JWTHelper from "../helpers/jwt";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import PlanModel from "../models/plans.model";
import UserSubscriptionModel from "../models/user.subscription.model";

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
}: {
  email: string;
  username: string;
}) => {
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      email,
      username,
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
