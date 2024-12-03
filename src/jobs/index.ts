import { Subscription } from "paystack-sdk/dist/subscription/subscription";
import User from "../models/user.model";
import UserSubscriptionModel from "../models/user.subscription.model";
import { endOfToday } from "date-fns";
import { IUser } from "../interfaces/models/user.interface";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import sendMail from "../helpers/mailer";
import { subscriptionExpiresSoonEmailHTML } from "../templates/subscriptionExpiresSoonEmail";
import { subscriptionExpiresEmailHTML } from "../templates/subscriptionExpiresEmail";
import PlanModel from "../models/plans.model";
import cron from "node-cron";
import settings from "../constants/settings";
import axios from "axios";

const serverUrl = process.env.SERVER_BASE_URL ?? "";

export async function runJobs() {
  cron.schedule("0 0 * * *", handleSubscriptionJob);
  // cron.schedule("*/12 * * * *", pingServer); //Make the Server Active
  cron.schedule("*/13 * * * *", pingAiSearchServer); //Make the Server Active every 12 minutes
  cron.schedule("0 * * * *", notifyAndDeactivateSubscriptions);
}

async function handleSubscriptionJob() {
  try {
    const expiredSubscriptions = await UserSubscriptionModel.find({
      expiryDate: { $lt: new Date() }, // Expired subscriptions
      plan: { $ne: "65dc534815ce9430aa0ab114" },
      isActive: true,
    });

    for (const subscription of expiredSubscriptions) {
      subscription.plan = "65dc534815ce9430aa0ab114"; // Reset plan to free
      // subscription.isActive = false;
      await subscription.save();
    }
  } catch (error) {
    console.error("Error processing expired subscriptions:", error);
  }
}

async function pingAiSearchServer() {
  try {
    const response = await axios.post(
      "https://safelink-search-api.onrender.com/search",
      { query: "ping" },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("AI search server pinged successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error pinging the server:", error.message);
    } else {
      console.error("Error pinging the server:", error);
    }
  }
}

async function notifyAndDeactivateSubscriptions() {
  try {
    const currentDate = new Date();
    const next72Hours = new Date(currentDate.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now

    // Notify about expiring subscriptions
    await notifyExpiringSubscriptions(currentDate, next72Hours);

    // Deactivate expired subscriptions
    await deactivateExpiredSubscriptions(currentDate);
  } catch (error) {
    console.error(
      "Error in subscription notification and deactivation:",
      error
    );
  }
}

async function notifyExpiringSubscriptions(
  currentDate: Date,
  next72Hours: Date
) {
  const subscriptionsExpiringSoon = await UserSubscriptionModel.find({
    expiryDate: { $gte: currentDate, $lte: next72Hours },
    isActive: true,
    notified72HoursBefore: false,
  }).populate<{ user: IUser }>("user");

  for (const subscription of subscriptionsExpiringSoon) {
    try {
      const user = subscription.user;

      // Send email notification
      await sendMail({
        to: user.email,
        subject: "Last Chance – Your SafeLink Subscription Ends Tomorrow",
        html: subscriptionExpiresSoonEmailHTML(user),
      });

      // Mark notification as sent
      subscription.notified72HoursBefore = true;
      await subscription.save();
    } catch (error) {
      console.error(`Failed to notify user ${subscription.user.email}:`, error);
    }
  }
}

async function deactivateExpiredSubscriptions(currentDate: Date) {
  const expiredSubscriptions = await UserSubscriptionModel.find({
    expiryDate: { $lt: currentDate },
    isActive: true,
    notifiedOnExpiry: false,
  }).populate<{ user: IUser }>("user");

  const freemiumPlan = await PlanModel.findOne({ name: PlansEnum.FREE });

  for (const subscription of expiredSubscriptions) {
    try {
      const user = subscription.user;

      // Deactivate subscription
      subscription.isActive = false;
      if (freemiumPlan) {
        subscription.plan = freemiumPlan._id;
      } else {
        console.error("Freemium plan not found, skipping plan reset");
      }
      subscription.expiryDate = null;

      // Send email notification
      await sendMail({
        to: user.email,
        subject: "Subscription Expired",
        html: subscriptionExpiresEmailHTML(user),
      });

      // Mark as notified on expiry
      subscription.notifiedOnExpiry = true;
      await subscription.save();

      console.log(`Subscription expired for user ${user.email}`);
    } catch (error) {
      console.error(
        `Failed to deactivate subscription for user ${subscription.user.email}:`,
        error
      );
    }
  }
}
