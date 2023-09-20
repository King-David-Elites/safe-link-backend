"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const collections_1 = __importDefault(require("../interfaces/collections"));
const CompanySchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    websiteUrl: { type: String },
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    address1: { type: String, required: true },
    address2: { type: String },
    country: { type: String },
    city: { type: String },
    zipCode: { type: String },
    email: { type: String, required: true },
    alternativeEmail: { type: String },
    phoneNumber1: { type: Number, required: true },
    phoneNumber2: { type: Number },
    coverPicture: { type: String, required: true },
    ownedBy: { type: mongoose_1.Types.ObjectId, ref: collections_1.default.user, required: true },
});
const Company = mongoose_1.default.model(collections_1.default.company, CompanySchema);
exports.default = Company;
