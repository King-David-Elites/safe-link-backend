import mongoose from "mongoose";
import { InfluencerReferral } from "../interfaces/models/influencer-referral.interface";
import User from "../models/user.model";

const currentDate = new Date();
const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11
const currentYear = currentDate.getFullYear();

const getReferralsByInfluencers = async (
  month: number = currentMonth,
  year: number = currentYear
): Promise<InfluencerReferral[]> => {
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 1); // Start of the next month
  const freePlan = "65dc534815ce9430aa0ab118";

  const pipeline = [
    // Match users referred by influencers
    {
      $match: {
        referredBy: { $exists: true, $ne: null },
      },
    },
    // Lookup the influencer details
    {
      $lookup: {
        from: "influencers", // Influencer collection name in DB
        localField: "referredBy",
        foreignField: "_id",
        as: "influencer",
      },
    },
    {
      $unwind: "$influencer", // Unwind the influencer array
    },
    // Lookup the user subscription details
    {
      $lookup: {
        from: "usersubscriptions", // UserSubscription collection name in DB
        localField: "_id",
        foreignField: "user",
        as: "subscription",
      },
    },
    {
      $unwind: "$subscription", // Unwind the subscription array
    },
    // Match subscriptions created in the current month and exclude the free plan
    {
      $match: {
        "subscription.createdAt": { $gte: startOfMonth, $lt: endOfMonth },
        "subscription.plan": { $ne: new mongoose.Types.ObjectId(freePlan) },
      },
    },
    // Group by influencer and count referred users
    {
      $group: {
        _id: "$influencer._id",
        influencerName: { $first: "$influencer.name" },
        referralCode: { $first: "$influencer.referralCode" },
        referredCount: { $sum: 1 },
      },
    },
    // Project the final output
    {
      $project: {
        _id: 0,
        influencerId: "$_id",
        influencerName: 1,
        referralCode: 1,
        referredCount: 1,
      },
    },
  ];

  const referrals = await User.aggregate(pipeline).exec(); // Ensure execution
  return referrals;
};

const referralService = {
  getReferralsByInfluencers,
};

export default referralService;
