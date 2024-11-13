import { Subscription } from "paystack-sdk/dist/subscription/subscription";
import UserSubscriptionModel from "../models/user.subscription.model";
import { endOfToday } from "date-fns";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import cron from "node-cron";
import settings from "../constants/settings";
import axios from "axios";

const serverUrl = "http://localhost:3001/api/v1"; //process.env.SERVER_BASE_URL ?? "";

export async function runJobs() {
  cron.schedule("0 0 * * *", handleSubscriptionJob);
  cron.schedule("*/12 * * * *", pingServer); //Make the Server Active every 12 minutes
}

async function handleSubscriptionJob() {
  try {
    const subscriptions = await UserSubscriptionModel.find({
      expiryDate: { $gt: endOfToday() },
      name: { $ne: PlansEnum.FREE },
      isActive: true,
    });

    for (const subscription of subscriptions) {
      subscription.isActive = false;
      // sendReminderMail
      await subscription.save();
    }
  } catch (error) {
    console.error(error);
  }
}

async function pingServer() {
  try {
    const response = await axios.get(`${serverUrl}/ping/ping`);
    console.log("Server pinged successfully", response.data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error pinging the server:", error.message);
    } else {
      console.error("Error pinging the server:", error);
    }
  }
}
