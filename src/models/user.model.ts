// models/user.model.ts
import mongoose, { Schema, Types } from "mongoose";
import { IUser, SubscriptionStatus } from "../interfaces/models/user.interface";
import Collections from "../interfaces/collections";

const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    about: { type: String },
    profilePicture: { type: String, default: "" },
    coverPicture: { type: String, default: "" },
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
    isProfileCompleted: { type: Boolean, default: false },
    formattedUsername: { type: String },
    shareableLink: { type: String, default: null },
    referredBy: { type: Schema.Types.ObjectId, ref: "Influencer" }, // Foreign key to Influencer
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Middleware to update the shareableLink when updating a user document
UserSchema.pre("save", function (next) {
  // Check if `username` or `isProfileCompleted` has been modified
  if (this.isModified("username") || this.isModified("isProfileCompleted")) {
    // If the profile is complete, generate the shareable link
    if (this.isProfileCompleted) {
      const formattedUsername = this.username
        ?.replace(/\s+/g, "-")
        .toLowerCase();
      this.shareableLink = `https://www.joinsafelink.com/${formattedUsername}`;
    } else {
      // If profile is incomplete, reset the shareable link
      this.shareableLink = "";
    }
  }
  next();
});

UserSchema.pre("findOneAndUpdate", function (next) {
  // Access the updated fields
  const updates = this.getUpdate();

  // If `username` or `isProfileCompleted` is being updated
  if (
    updates &&
    ((updates as mongoose.UpdateQuery<any>).username ||
      (updates as mongoose.UpdateQuery<any>).isProfileCompleted !== undefined)
  ) {
    // Retrieve the new values for these fields
    const isProfileCompleted =
      (updates as mongoose.UpdateQuery<any>).isProfileCompleted ??
      this.get("isProfileCompleted");
    const username =
      (updates as mongoose.UpdateQuery<any>).username ?? this.get("username");

    if (isProfileCompleted) {
      const formattedUsername = username?.trim().replace(/\s+/g, "-");
      (updates as mongoose.UpdateQuery<any>).$set = {
        shareableLink: `https://www.joinsafelink.com/${formattedUsername}`,
      };
    } else {
      (updates as mongoose.UpdateQuery<any>).$set = { shareableLink: null };
    }

    // Ensure the updated fields are applied
    this.setUpdate(updates);
  }
  next();
});

// Add a virtual field for dynamic shareable link generation (only when profile is complete)
UserSchema.virtual("dynamicShareableLink").get(function () {
  if (!this.isProfileCompleted) {
    return null; // Only generate the link if the profile is complete
  }
  const formattedUsername = this.username?.replace(/\s+/g, "-");
  return `https://www.joinsafelink.com/${formattedUsername}`;
});

const User = mongoose.model(Collections.user, UserSchema);

export default User;
