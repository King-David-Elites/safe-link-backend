import { Plan } from "paystack-sdk/dist/plan";
import { Relations } from ".";
import { IUser } from "./user.interface";
import { Customer } from "paystack-sdk/dist/customer/interface";
import { SubscriptionCreated } from "paystack-sdk/dist/subscription";

export interface ISubscriptionPlan {
  _id: string;
  name: PlansEnum;
  price: number;
  slashedPrice: number;
  listingsCap: number;
  duration: number; // months
  planCode: string;
  benefits: string[];
}

export enum PlansEnum {
  FREE = "free",
  BASIC = "basic",
  PLUS = "plus",
  PREMIUM = "premium",
  PLATINUM = "platinum",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

export interface IPaymentAttempt {
  status: PaymentStatus;
  amount: number;
  plan: Relations<ISubscriptionPlan>;
  user: Relations<IUser>;
  transaction_reference: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSubscription {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  user: Relations<IUser>;
  plan: Relations<ISubscriptionPlan>;
  isActive: boolean;
  expiryDate?: Date | null;
  code: string;
  email_token: string;
  notifiedOnExpiry?: boolean;
  notified72HoursBefore?: boolean;
  notified24HoursBefore?: boolean;
}

export enum WebhookStatus {
  SUCCESS = "success",
  FAILED = "failed",
}

export enum WebhookEvents {
  CHARGE_SUCCESS = "charge.success",
  CHARGE_FAILED = "charge.failed",
  TRANSFER_SUCCESS = "transfer.success",
  TRANSFER_FAILED = "transfer.failed",
  TRANSFER_REVERSED = "transfer.reversed",
  SUBSCRIPTION_CREATED = "subscription.create",
  SUBSCRIPTION_DISABLED = "subscription.disable",
}

export interface ChargeResponse {
  reference: string;
  status: WebhookStatus;
  amount: number;
  reason: string;
  customer: Customer;
}

export interface WebhookResponse {
  event: WebhookEvents;
  data: ChargeResponse | SubscriptionCreated["data"];
}
