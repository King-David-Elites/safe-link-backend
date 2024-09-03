import mongoose, { Types } from 'mongoose';
import { IUser } from '../interfaces/models/user.interface';
import { string } from 'yup';
import Collections from '../interfaces/collections';

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
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
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model(Collections.user, UserSchema);

export default User;
