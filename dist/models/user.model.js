"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const collections_1 = __importDefault(require("../interfaces/collections"));
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
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
    phoneNumber1: { type: Number, unique: true },
    phoneNumber2: { type: Number },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const User = mongoose_1.default.model(collections_1.default.user, UserSchema);
exports.default = User;
