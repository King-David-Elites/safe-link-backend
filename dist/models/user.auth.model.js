"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const collections_1 = __importDefault(require("../interfaces/collections"));
const argon2_1 = __importDefault(require("argon2"));
const AuthSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
AuthSchema.pre("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            this.password = yield argon2_1.default.hash(this.password);
        }
        return;
    });
});
AuthSchema.methods.verifyPassword = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        const isPasswordCorrect = yield argon2_1.default.verify(this.password, password);
        return isPasswordCorrect;
    });
};
const Auth = mongoose_1.default.model(collections_1.default.auth, AuthSchema);
exports.default = Auth;
