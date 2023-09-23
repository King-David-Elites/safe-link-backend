import mongoose from "mongoose";
import { IUser } from "../interfaces/models/user.interface";
import { string } from "yup";
import Collections from "../interfaces/collections";

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    about: { type: String },
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    profilePicture: { type: String, default: "" },
    professionalPictures: { type: [{ type: String }], default: [] },
    workPictures: { type: [{ type: String }], default: [] },
    leisurePictures: { type: [{ type: String }], default: [] },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    phoneNumber1: { type: Number },
    phoneNumber2: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model(Collections.user, UserSchema);

export default User;
