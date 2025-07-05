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
import { newYearEmailHTML } from "../templates/newYearEmail";
import { safelinkFreeEmailHTML } from "../templates/safelinkGoingFreeEmail";
import { dontStressEmailHTML } from ".../templates/dontStressEmail";
import PlanModel from "../models/plans.model";
import cron from "node-cron";
import settings from "../constants/settings";
import axios from "axios";
import Influencer from "../models/influencer.model";
import BackupUserSubscriptionModel from "../models/backup.user.subscription.model";
import mongoose from "mongoose";
import { julyGreetingsEmailHTML } from "../templates/julygreetingsEmail";

const serverUrl = process.env.SERVER_BASE_URL ?? "";

export async function runJobs() {
  cron.schedule("0 0 * * *", handleSubscriptionJob);
  // cron.schedule("*/12 * * * *", pingServer); //Make the Server Active
  // cron.schedule("*/13 * * * *", pingAiSearchServer); //Make the Server Active every 12 minutes
  cron.schedule("0 * * * *", notifyExpiringSubscriptions);
  cron.schedule("0 7 25 12 *", sendChristmasNotification); // Christmas Notification at 7:00AM WAT
  cron.schedule("45 10 1 1 *", sendNewYearNotification); // New Year Notification at 10:45AM WAT

  //July Greeting Notification at 10:00PM WAT on July 1st
  cron.schedule("30 12 2 7 *", julyGreetingsNotification, {
    timezone: "Africa/Lagos",
  });

  //Dont Stress Yourself Notification Email
  cron.schedule("00 7 5 7 *", dontStressEmailNotification, {
    timezone: "Africa/Lagos"
  });
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

async function sendNewYearNotification() {
  try {
    const users = await User.find({}); // Retrieve all users

    for (const user of users) {
      try {
        // Send New Year Email
        await sendMail({
          to: user.email,
          subject: "Happy New Year 🎄",
          html: newYearEmailHTML(user),
        });

        console.log(`new Year email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send New Year email to ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error sending new year notifications:", error);
  }
}

async function goingFreeNotification() {
  try {
    const users = await User.find({}); // Retrieve all users

    for (const user of users) {
      try {
        // Send New Year Email
        await sendMail({
          to: user.email,
          subject: "Promote your Business with Safelink",
          html: safelinkFreeEmailHTML(user),
        });

        console.log(`new Year email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send New Year email to ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error sending new year notifications:", error);
  }
}

async function julyGreetingsNotification() {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Lagos",
  }); // format: YYYY-MM-DD

  if (today !== "2025-07-02") return;

  try {
    const users = await User.find({}); // Retrieve all users

    for (const user of users) {
      try {
        await sendMail({
          to: user.email,
          subject: "Happy New Month 🎉",
          html: julyGreetingsEmailHTML(user),
        });

        console.log(`July greeting email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send July greeting to ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error sending July greeting notifications:", error);
  }
}

async function dontStressEmailNotification() {
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Lagos",
  }); // format: YYYY-MM-DD

  if (today !== "2025-07-05") return;

  try {
    const users = await User.find({}); // Retrieve all users

    for (const user of users) {
      try {
        await sendMail({
          to: user.email,
          subject: "Don’t Let WhatsApp Stress You This Weekend 😩",
          html: dontStressEmailHTML(user),
        });

        console.log(`Notification email sent to ${user.email}`);
      } catch (error) {
        console.error(`Failed to send Notification to ${user.email}:`, error);
      }
    }
  } catch (error) {
    console.error("Error sending  notifications:", error);
  }
}

