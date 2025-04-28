import { config } from "dotenv";
import { Paystack } from "paystack-sdk";
import mongoose from "mongoose";
import UserSubscriptionModel from "../models/user.subscription.model";
import PlanModel from "../models/plans.model";
import { PlansEnum } from "../interfaces/models/subscription.interface";
import User from "../models/user.model";

// Load environment variables
config();

// Initialize Paystack
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

async function cancelAllSubscriptions() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("Connected to MongoDB");

    // Get the free plan ID
    const freePlan = await PlanModel.findOne({ name: PlansEnum.FREE });
    if (!freePlan) {
      throw new Error("Free plan not found in database");
    }

    // Get all active paid subscriptions
    const activeSubscriptions = await UserSubscriptionModel.find({
      isActive: true,
      plan: { $ne: freePlan._id },
    });

    console.log(
      `Found ${activeSubscriptions.length} active subscriptions to cancel`
    );

    // Process each subscription
    for (const subscription of activeSubscriptions) {
      try {
        if (subscription.code && subscription.email_token) {
          // Cancel subscription on Paystack
          await paystack.subscription.disable({
            code: subscription.code,
            token: subscription.email_token,
          });
          console.log(
            `Cancelled Paystack subscription for subscription ID: ${subscription._id}`
          );
        }

        // Update subscription in database
        await UserSubscriptionModel.findByIdAndUpdate(subscription._id, {
          plan: freePlan._id,
          expiryDate: null,
          isActive: true,
          code: null,
          email_token: null,
        });

        console.log(`Updated database subscription ID: ${subscription._id}`);
      } catch (error) {
        console.error(
          `Error processing subscription ${subscription._id}:`,
          error
        );
        // Continue with next subscription even if one fails
        continue;
      }
    }

    console.log("Finished cancelling all subscriptions");
  } catch (error) {
    console.error("Error in cancelAllSubscriptions:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
cancelAllSubscriptions();
