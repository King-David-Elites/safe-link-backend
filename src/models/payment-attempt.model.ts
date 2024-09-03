import mongoose, { Schema, Types } from 'mongoose';
import {
  IPaymentAttempt,
  PaymentStatus,
} from '../interfaces/models/subscription.interface';
import Collections from '../interfaces/collections';

const PaymentAttemptSchema = new Schema<IPaymentAttempt>(
  {
    amount: {
      type: Number,
    },
    plan: {
      type: Types.ObjectId,
      ref: Collections.subscriptionPlan,
    },
    user: {
      type: Types.ObjectId,
      ref: Collections.user,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    transaction_reference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const PaymentAttemptModel = mongoose.model(
  Collections.paymentAttempt,
  PaymentAttemptSchema
);
export default PaymentAttemptModel;
