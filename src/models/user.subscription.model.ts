import mongoose, { Schema, Types } from 'mongoose';
import { UserSubscription } from '../interfaces/models/subscription.interface';
import Collections from '../interfaces/collections';

const UserSubscriptionSchema = new Schema<UserSubscription>(
  {
    user: {
      type: Types.ObjectId,
      ref: Collections.user,
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    plan: {
      type: Types.ObjectId,
      ref: Collections.subscriptionPlan,
    },
    code: {
      type: String,
    },
    email_token: {
      type: String,
    },
    notifiedOnExpiry: { type: Boolean, default: false },
    notified72HoursBefore: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const UserSubscriptionModel = mongoose.model(
  Collections.userSubscription,
  UserSubscriptionSchema
);
export default UserSubscriptionModel;
