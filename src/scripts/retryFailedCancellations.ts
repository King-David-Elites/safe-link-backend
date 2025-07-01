import { config } from "dotenv";
import { Paystack } from "paystack-sdk";
import mongoose from "mongoose";
import UserSubscriptionModel from "../models/user.subscription.model";
import PlanModel from "../models/plans.model";
import { PlansEnum } from "../interfaces/models/subscription.interface";

// Load environment variables
config();

// Initialize Paystack
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

async function retryFailedCancellations() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("Connected to MongoDB");

    // Get the free plan ID
    const freePlan = await PlanModel.findOne({ name: PlansEnum.FREE });
    if (!freePlan) {
      throw new Error("Free plan not found in database");
    }

    // Find subscriptions that still have Paystack details (indicating failed cancellation)
    const failedCancellations = await UserSubscriptionModel.find({
      code: { $ne: null },
      email_token: { $ne: null },
    });

    console.log(
      `Found ${failedCancellations.length} subscriptions to retry cancellation`
    );

    // Process each subscription
    for (const subscription of failedCancellations) {
      try {
        console.log(
          `Attempting to cancel subscription ID: ${subscription._id}`
        );

        // Attempt to cancel on Paystack
        await paystack.subscription.disable({
          code: subscription.code!,
          token: subscription.email_token!,
        });
        console.log(
          `Successfully cancelled Paystack subscription for ID: ${subscription._id}`
        );

        // Update subscription in database
        await UserSubscriptionModel.findByIdAndUpdate(subscription._id, {
          code: null,
          email_token: null,
        });

        console.log(
          `Updated database record for subscription ID: ${subscription._id}`
        );
      } catch (error: any) {
        console.error(
          `Error processing subscription ${subscription._id}:`,
          error?.message || error
        );

        // If Paystack says subscription is already cancelled, update our database
        if (
          error?.response?.data?.message
            ?.toLowerCase()
            .includes("subscription already cancelled")
        ) {
          console.log(
            `Subscription ${subscription._id} was already cancelled on Paystack. Updating database...`
          );
          await UserSubscriptionModel.findByIdAndUpdate(subscription._id, {
            code: null,
            email_token: null,
          });
        }
        continue;
      }
    }

    console.log("Finished retrying failed cancellations");
  } catch (error) {
    console.error("Error in retryFailedCancellations:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the script
retryFailedCancellations();
