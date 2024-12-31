import mongoose, { Schema } from "mongoose";
import Collections from "../interfaces/collections";

const ReferralSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: Collections.user,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    bankCode: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    referralCode: {
      type: String,
      unique: true,
      required: true,
    },
    referralLink: {
      type: String,
      unique: true,
      required: true,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    lastPayoutDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Create a compound index for user and referralCode
ReferralSchema.index({ user: 1, referralCode: 1 });

const Referral = mongoose.model(Collections.referral, ReferralSchema);

export default Referral;
