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
const errors_1 = require("../constants/errors");
const user_auth_model_1 = __importDefault(require("../models/user.auth.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const argon2_1 = __importDefault(require("argon2"));
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(id);
    if (!user) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    return user;
});
const getByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    return user;
});
const changePassword = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, confirmNewPassword, newPassword, oldPassword } = body;
    if (newPassword !== confirmNewPassword) {
        throw new errors_1.BadRequestError("New password and confirm new password do not match");
    }
    const user = yield userService.getById(userId);
    const userAuth = yield user_auth_model_1.default.findOne({ email: user.email });
    if (!userAuth) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    const isPasswordMatch = yield (userAuth === null || userAuth === void 0 ? void 0 : userAuth.verifyPassword(oldPassword));
    if (!isPasswordMatch) {
        throw new errors_1.BadRequestError("Old password is incorrect");
    }
    const newPasswordHash = yield argon2_1.default.hash(newPassword);
    userAuth.password = newPasswordHash;
    yield userAuth.save();
});
const userService = {
    getById,
    getByEmail,
    changePassword,
};
exports.default = userService;
