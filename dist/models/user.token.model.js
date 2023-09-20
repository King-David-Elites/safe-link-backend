"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const user_interface_1 = require("../interfaces/models/user.interface");
const crypto_1 = require("crypto");
const collections_1 = __importDefault(require("../interfaces/collections"));
const FIFTEEN_MINUTES = 60 * 15;
const TokenSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    value: { type: String, required: true, default: (0, crypto_1.randomUUID)() },
    type: { type: String, enum: Object.values(user_interface_1.ITokenTypes), required: true },
    expireAt: {
        type: Date,
        default: Date.now,
        expires: FIFTEEN_MINUTES,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const Token = mongoose_1.default.model(collections_1.default.token, TokenSchema);
exports.default = Token;
