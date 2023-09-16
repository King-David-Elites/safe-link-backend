import mongoose from "mongoose";
import { IUser } from "../interfaces/models/user.interface";
import { string } from "yup";
import Collections from "../interfaces/collections";

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    about: { type: String, required: true },
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
    phoneNumber1: { type: Number, unique: true },
    phoneNumber2: { type: Number },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model(Collections.user, UserSchema);

export default User;
