/**
 * @flow - create subscription, disable subscription.
 */

import { v4 } from "uuid";
import { BadRequestError, NotFoundError } from "../constants/errors";
import { CustomError, notFoundError } from "../handlers/error.handlers";
import PaymentAttemptModel from "../models/payment-attempt.model";
import PlanModel from "../models/plans.model";
import User from "../models/user.model";
import UserSubscriptionModel from "../models/user.subscription.model";
import { Paystack } from "paystack-sdk";
import { config } from "dotenv";
import {
  ChargeResponse,
  ISubscriptionPlan,
  PaymentStatus,
  PlansEnum,
  WebhookEvents,
  WebhookResponse,
} from "../interfaces/models/subscription.interface";
import * as crypto from "crypto";
import { SubscriptionCreated } from "paystack-sdk/dist/subscription";
import { add } from "date-fns";

config();

const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export async function subscribeForPlan(userId: string, planId: string) {
  const plan = await PlanModel.findById(planId);
  if (!plan) throw new NotFoundError("Plan does not exist");

  const user = await User.findById(userId);
  if (!user) throw new NotFoundError("User does not exist");

  const userPlan = await UserSubscriptionModel.findOne({
    user: userId,
    plan: planId,
    isActive: true,
  });
  if (userPlan)
    throw new BadRequestError("You are already subscribed to this plan");

  const transaction_reference = v4();

  await PaymentAttemptModel.create({
    user: userId,
    amount: plan.price,
    transaction_reference,
    plan: plan._id,
  });

  let customer;
  try {
    customer = await paystack.customer.fetch(user.email);
  } catch (error) {
    console.error(`Error fetching customer: ${error}`);
  }

  if (!customer?.status) {
    // Create customer if fetching failed
    try {
      customer = await paystack.customer.create({
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        phone: user.phoneNumber,
      });
      if (!customer.status) throw new Error("Failed to create customer");
    } catch (error) {
      console.error(`Error creating customer: ${error}`);
      throw new BadRequestError(
        "Unable to process subscription now, try again later"
      );
    }
  }

  const response = await paystack.transaction.initialize({
    amount: JSON.stringify(plan.price * 100), // Converting to kobo
    email: customer?.data?.email ?? "",
    currency: "NGN",
    reference: transaction_reference,
    plan: plan.planCode,
    // channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
  });

  if (!response.status) {
    throw new BadRequestError(response.message);
  }

  return response?.data?.authorization_url;
}

export async function cancelSubscription(userId: string) {
  const freemiumPlan = await PlanModel.findOne({ name: PlansEnum.FREE });

  const userPlan = await UserSubscriptionModel.findOne({ user: userId });

  if (!userPlan) throw new NotFoundError("user is not subscribed to any plan");

  if (String(userPlan._id) != String(freemiumPlan?._id) && userPlan.code) {
    await paystack.subscription.disable({
      code: userPlan.code,
      token: userPlan.email_token,
    });

    userPlan.plan = freemiumPlan?._id!;
    userPlan.expiryDate = null;
    userPlan.isActive = true;

    await userPlan.save();
  }
}

export async function getPlans() {
  return await PlanModel.find({}).sort({ price: 1 });
}

export function verifyWebhook(signature: string, body: WebhookResponse) {
  const secret = process.env.PAYSTACK_SECRET_KEY!;

  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(body))
    .digest("hex");
  return hash === signature;
}

export async function handleWebhooks(body: WebhookResponse) {
  switch (body.event) {
    case WebhookEvents.CHARGE_SUCCESS: {
      const response = body.data as ChargeResponse;

      const paymentLog = await PaymentAttemptModel.findOne({
        transaction_reference: response.reference,
      }).populate([{ path: "plan" }]);

      if (paymentLog) {
        const user = await User.findById(paymentLog.user);
        if (!user) throw new NotFoundError("user not found");

        const plan = paymentLog.plan as ISubscriptionPlan;

        await UserSubscriptionModel.findOneAndUpdate(
          {
            user: paymentLog.user,
          },
          {
            plan: plan._id,
            expiryDate: add(new Date(), { months: plan.duration }),
            isActive: true,
          }
        );
        paymentLog.status = PaymentStatus.SUCCESSFUL;
        await paymentLog.save();
      }
    }
    case WebhookEvents.CHARGE_FAILED: {
      const response = body.data as ChargeResponse;

      const paymentLog = await PaymentAttemptModel.findOne({
        transaction_reference: response.reference,
      }).populate([{ path: "plan" }]);

      if (paymentLog) {
        paymentLog.status = PaymentStatus.FAILED;
        await paymentLog.save();
      }
    }
    case WebhookEvents.TRANSFER_SUCCESS:
      throw new CustomError(503, "Method not implemented");
    case WebhookEvents.TRANSFER_FAILED:
      throw new CustomError(503, "Method not implemented");
    case WebhookEvents.TRANSFER_REVERSED:
      throw new CustomError(503, "Method not implemented");
    case WebhookEvents.SUBSCRIPTION_CREATED: {
      const response = body.data as SubscriptionCreated["data"];

      const email = response.customer.email;
      const user = await User.findOne({ email });

      if (user) {
        const prevPlan = await UserSubscriptionModel.findOne({ user: user.id });

        await UserSubscriptionModel.findOneAndUpdate(
          { user: user.id },
          {
            code: response.subscription_code,
            email_token: response.email_token,
          }
        );

        if (prevPlan && prevPlan.code) {
          await paystack.subscription.disable({
            code: prevPlan.code,
            token: prevPlan.email_token,
          });
        }
      }

      break;
    }
    case WebhookEvents.SUBSCRIPTION_DISABLED:
      throw new CustomError(503, "Method not implemented");
  }
}

export async function getAllSubscribedUsers() {
  try {
    const activeSubscriptions = await UserSubscriptionModel.find({
      isActive: true,
      // expiryDate: { $gte: new Date() },
    })
      .populate("user", "username firstName lastName email")
      .populate("plan", "name");

    return activeSubscriptions;
  } catch (error) {
    console.error("Error fetching subscribed users:", error);
    throw new Error("Could not retrieve subscribed users");
  }
}

export async function getUserSubscriptionStatus(userId: string) {
  try {
    const subscription = await UserSubscriptionModel.findOne({
      user: userId,
      // isActive: true,
    }).populate("plan");

    if (!subscription) {
      return { message: "No active subscription found" };
    }

    return subscription;
  } catch (error) {
    console.error(
      `Error fetching subscription status for user ${userId}:`,
      error
    );
    throw new Error("Could not retrieve subscription status");
  }
}

// export const manuallyUpdateCustomerSubscription = async (
//   id: string,
//   reference: string
// ) => {
//   const paymentLog = await PaymentAttemptModel.findOne({
//     transaction_reference: reference,
//   }).populate([{ path: "plan" }]);

//   if (paymentLog) {
//     const user = await User.findById(paymentLog.user);
//     if (!user) throw new NotFoundError("user not found");

//     const plan = paymentLog.plan as ISubscriptionPlan;

//     await UserSubscriptionModel.findOneAndUpdate(
//       {
//         user: paymentLog.user,
//       },
//       {
//         plan: plan._id,
//         expiryDate: add(new Date(), { months: plan.duration }),
//         isActive: true,
//       }
//     );
//     paymentLog.status = PaymentStatus.SUCCESSFUL;
//     console.log("payment log", paymentLog);
//     await paymentLog.save();
//   } else {
//     console.log("payment not found");
//     throw new NotFoundError("payment not found");
//   }
// };
