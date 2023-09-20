import mongoose from "mongoose";
import { IToken, ITokenTypes } from "../interfaces/models/user.interface";
import { randomUUID } from "crypto";
import Collections from "../interfaces/collections";

const FIFTEEN_MINUTES = 60 * 15;

const TokenSchema = new mongoose.Schema<IToken>(
  {
    email: { type: String, required: true },
    value: { type: String, required: true, default: randomUUID() },
    type: { type: String, enum: Object.values(ITokenTypes), required: true },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: FIFTEEN_MINUTES,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Token = mongoose.model(Collections.token, TokenSchema);

export default Token;
