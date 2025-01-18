import { Subscription } from "paystack-sdk/dist/subscription/subscription";
import User from "../models/user.model";
import UserSubscriptionModel from "../models/user.subscription.model";
import { endOfToday } from "date-fns";
import { IUser } from "../interfaces/models/user.interface";
import {
  PlansEnum,
  UserSubscription,
} from "../interfaces/models/subscription.interface";
import sendMail from "../helpers/mailer";
import { subscriptionExpires72HoursEmailHTML } from "../templates/subscriptionExpires72HoursEmail";
import { subscriptionExpires24HoursEmailHTML } from "../templates/subscriptionExpires24HoursEmail";
import { christmasEmailHTML } from "../templates/christmasEmail";
import PlanModel from "../models/plans.model";
import cron from "node-cron";
import settings from "../constants/settings";
import axios from "axios";
import Influencer from "../models/influencer.model";
import BackupUserSubscriptionModel from "../models/backup.user.subscription.model";
import mongoose from "mongoose";

const serverUrl = process.env.SERVER_BASE_URL ?? "";

export async function runJobs() {
  cron.schedule("0 0 * * *", handleSubscriptionJob);
  // cron.schedule("*/12 * * * *", pingServer); //Make the Server Active
  // cron.schedule("*/13 * * * *", pingAiSearchServer); //Make the Server Active every 12 minutes
  cron.schedule("0 * * * *", notifyExpiringSubscriptions);
  cron.schedule("0 7 25 12 *", sendChristmasNotification); // Christmas Notification at 7:00AM WAT
}

const freePlan = "65dc534815ce9430aa0ab114";
export async function handleSubscriptionJob() {
  try {
    const expiredSubscriptions = await UserSubscriptionModel.find({
      expiryDate: { $lt: new Date() }, // Expired subscriptions
      plan: { $ne: freePlan },
      isActive: true,
    });

    for (const subscription of expiredSubscriptions) {
      subscription.plan = freePlan; // Reset plan to free
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
    // console.log("AI search server pinged successfully");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error pinging the server:", error.message);
    } else {
      console.error("Error pinging the server:", error);
    }
  }
}

async function notifyExpiringSubscriptions() {
  const currentDate = new Date();
  const next72Hours = new Date(currentDate.getTime() + 72 * 60 * 60 * 1000); // 72 hours from now
  const next24Hours = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  try {
    // Notify 72 hours before subscription ends
    await sendExpiryNotifications(
      currentDate,
      next72Hours,
      "notified72HoursBefore",
      subscriptionExpires72HoursEmailHTML,
      "Reminder: Your SafeLink Subscription Ends in 72 Hours"
    );

    // Notify 24 hours before subscription ends
    await sendExpiryNotifications(
      currentDate,
      next24Hours,
      "notified24HoursBefore",
      subscriptionExpires24HoursEmailHTML,
      "Reminder: Your SafeLink Subscription Ends in 24 Hours"
    );
  } catch (error) {
    console.error("Error notifying subscriptions:", error);
  }
}

async function sendExpiryNotifications(
  currentDate: Date,
  notificationDate: Date,
  notificationFlag: "notified72HoursBefore" | "notified24HoursBefore",
  emailTemplate: (user: IUser) => string,
  emailSubject: string
) {
  const subscriptions = await UserSubscriptionModel.find({
    expiryDate: { $gte: currentDate, $lte: notificationDate },
    isActive: true,
    [notificationFlag]: false,
  }).populate<{ user: IUser }>("user");

  for (const subscription of subscriptions) {
    try {
      const user = subscription.user;

      // Send email notification
      await sendMail({
        to: user.email,
        subject: emailSubject,
        html: emailTemplate(user),
      });

      // Mark as notified
      subscription[notificationFlag] = true;
      await subscription.save();
      console.log(`Notification sent to ${user.email} (${notificationFlag})`);
    } catch (error) {
      console.error(`Failed to notify user ${subscription.user.email}:`, error);
    }
  }
}

async function sendChristmasNotification() {
  try {
    const users = await User.find({}); // Retrieve all users

    for (const user of users) {
      try {
        // Send Christmas email
        await sendMail({
          to: user.email,
          subject: "Merry Christmas from SafeLink! 🎄",
          html: christmasEmailHTML(user),
        });

        console.log(`Christmas email sent to ${user.email}`);
      } catch (error) {
        console.error(
          `Failed to send Christmas email to ${user.email}:`,
          error
        );
      }
    }
  } catch (error) {
    console.error("Error sending Christmas notifications:", error);
  }
}

// async function deactivateExpiredSubscriptions(currentDate: Date) {
//   const expiredSubscriptions = await UserSubscriptionModel.find({
//     expiryDate: { $lt: currentDate },
//     isActive: true,
//     notifiedOnExpiry: false,
//   }).populate<{ user: IUser }>("user");

//   const freemiumPlan = await PlanModel.findOne({ name: PlansEnum.FREE });

//   for (const subscription of expiredSubscriptions) {
//     try {
//       const user = subscription.user;

//       // Deactivate subscription
//       subscription.isActive = false;
//       if (freemiumPlan) {
//         subscription.plan = freemiumPlan._id;
//       } else {
//         console.error("Freemium plan not found, skipping plan reset");
//       }
//       subscription.expiryDate = null;

//       // Send email notification
//       await sendMail({
//         to: user.email,
//         subject: "Subscription Expired",
//         html: subscriptionExpiresEmailHTML(user),
//       });

//       // Mark as notified on expiry
//       subscription.notifiedOnExpiry = true;
//       await subscription.save();

//       console.log(`Subscription expired for user ${user.email}`);
//     } catch (error) {
//       console.error(
//         `Failed to deactivate subscription for user ${subscription.user.email}:`,
//         error
//       );
//     }
//   }
// }

// New function to remove duplicate subscriptions with backup
// export async function removeDuplicateSubscriptionsWithBackup() {
//   try {
//     const duplicates = await UserSubscriptionModel.aggregate([
//       {
//         $match: { plan: new mongoose.Types.ObjectId(freePlan) },
//       },
//       {
//         $group: {
//           _id: "$user", // Group by user field
//           latestSubscription: { $max: "$updatedAt" }, // Get the latest updatedAt
//           subscriptions: { $push: "$$ROOT" }, // Push all subscriptions into an array
//           count: { $sum: 1 }, // Add count to only get groups with multiple subscriptions
//         },
//       },
//       {
//         $match: {
//           count: { $gt: 1 }, // Only get users with multiple subscriptions
//         },
//       },
//       {
//         $project: {
//           user: "$_id",
//           latestSubscription: 1,
//           subscriptions: 1,
//         },
//       },
//     ]);

//     console.log(
//       `Found ${duplicates.length} users with duplicate subscriptions`
//     );

//     for (const duplicate of duplicates) {
//       const { subscriptions } = duplicate;

//       // Keep the latest subscription and delete the rest
//       const latest = subscriptions.find(
//         (sub: UserSubscription) =>
//           sub.updatedAt.getTime() ===
//           new Date(duplicate.latestSubscription).getTime()
//       );

//       if (!latest) {
//         console.error(
//           `No latest subscription found for user ${duplicate.user}`
//         );
//         continue;
//       }

//       const toDelete = subscriptions.filter(
//         (sub: UserSubscription) => sub._id.toString() !== latest._id.toString()
//       );

//       // Backup the subscriptions before deletion
//       if (toDelete.length > 0) {
//         await BackupUserSubscriptionModel.insertMany(toDelete);

//         for (const subscription of toDelete) {
//           await UserSubscriptionModel.deleteOne({ _id: subscription._id });
//           console.log(
//             `Deleted duplicate subscription ${subscription._id} for user ${subscription.user}`
//           );
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error removing duplicate subscriptions:", error);
//     throw error; // Re-throw the error to be handled by the caller
//   }
// }
