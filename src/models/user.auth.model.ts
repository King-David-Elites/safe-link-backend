import mongoose from "mongoose";
import { IAuth } from "../interfaces/models/user.interface";
import Collections from "../interfaces/collections";
import argon2 from "argon2";

const AuthSchema = new mongoose.Schema<IAuth>(
  {
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

AuthSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await argon2.hash(this.password);
  }

  return;
});

AuthSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  const isPasswordCorrect = await argon2.verify(this.password, password);

  return isPasswordCorrect;
};

const Auth = mongoose.model(Collections.auth, AuthSchema);

export default Auth;
