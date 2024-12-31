import { Types } from "mongoose";

export interface IReferral {
  user: Types.ObjectId;
  bankName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  referralCode: string;
  referralLink?: string;
  totalEarnings: number;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  lastPayoutDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
