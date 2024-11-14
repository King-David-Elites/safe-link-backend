import mongoose, { Types } from 'mongoose';
import { IUser, SubscriptionStatus } from '../interfaces/models/user.interface';
import { string } from 'yup';
import Collections from '../interfaces/collections';

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String },
    about: { type: String },
    profilePicture: { type: String, default: '' },
    professionalPictures: [{ type: String }],
    workPictures: [{ type: String }],
    leisurePictures: [{ type: String }],
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    phoneNumber: { type: String },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.FREE,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model(Collections.user, UserSchema);

export default User;
