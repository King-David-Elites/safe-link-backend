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
const crypto_1 = require("crypto");
const errors_1 = require("../constants/errors");
const mailer_1 = __importDefault(require("../helpers/mailer"));
const user_interface_1 = require("../interfaces/models/user.interface");
const user_auth_model_1 = __importDefault(require("../models/user.auth.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const verifyEmail_1 = require("../templates/verifyEmail");
const token_service_1 = __importDefault(require("./token.service"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
const requestPasswordEmail_1 = require("../templates/requestPasswordEmail");
const user_service_1 = __importDefault(require("./user.service"));
const argon2_1 = __importDefault(require("argon2"));
const getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield user_auth_model_1.default.findById(id);
    if (!auth) {
        throw new errors_1.NotFoundError("auth does not exist");
    }
    return auth;
});
const getByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield user_auth_model_1.default.findOne({ email });
    if (!auth) {
        throw new errors_1.NotFoundError("auth does not exist");
    }
    return auth;
});
const createAccount = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, confirmPassword } = body;
    if (password != confirmPassword) {
        throw new errors_1.BadRequestError("Passwords do not match");
    }
    const auth = yield user_auth_model_1.default.create({ email, password });
    const user = yield user_model_1.default.create({
        email,
    });
    const token = yield token_service_1.default.createToken({
        email,
        type: user_interface_1.ITokenTypes.accountVerificationToken,
    });
    yield (0, mailer_1.default)({
        to: email,
        subject: "CREAM CARD ACCOUNT VERIFICATION",
        html: (0, verifyEmail_1.verifyEmailHTML)(user, token.value),
    });
});
const verifyAccount = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenInDb = yield token_service_1.default.getToken({
        value: token,
        type: user_interface_1.ITokenTypes.accountVerificationToken,
    });
    if (!tokenInDb) {
        throw new errors_1.BadRequestError("Token does not exist or has expired.");
    }
    const auth = yield user_auth_model_1.default.findOne({ email: tokenInDb.email });
    if (!auth) {
        throw new errors_1.NotFoundError("user with this email does not exist");
    }
    if (auth === null || auth === void 0 ? void 0 : auth.isVerified) {
        throw new errors_1.BadRequestError("Account is already verified");
    }
    auth.isVerified = true;
    yield auth.save();
    yield token_service_1.default.deleteToken({ _id: tokenInDb._id });
});
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = body;
    const authInDb = yield user_auth_model_1.default.findOne({ email });
    if (!authInDb) {
        throw new errors_1.NotFoundError("User does not exist");
    }
    const user = yield user_model_1.default.findOne({ email: authInDb.email });
    if (!authInDb.isVerified) {
        // send another verification email
        const token = (0, crypto_1.randomUUID)();
        yield token_service_1.default.updateToken({ email, type: user_interface_1.ITokenTypes.accountVerificationToken }, token);
        yield (0, mailer_1.default)({
            to: email,
            subject: "Verify Account Before Login",
            html: (0, verifyEmail_1.verifyEmailHTML)(user, token),
        });
        throw new errors_1.BadRequestError("Your account is not yet verified, kindly check your email for a new verification link");
    }
    const isPasswordMatch = yield authInDb.verifyPassword(password);
    if (!isPasswordMatch) {
        throw new errors_1.BadRequestError("Password is incorrect");
    }
    // send access token and user info
    const accessToken = yield jwt_1.default.signJWT(authInDb._id);
    return {
        accessToken,
        user: user,
    };
});
const requestForgotPasswordLink = (email) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Request their email
     * Check if there's already a token attached to their email, if yes update it, if not create a new one and send them the link
     */
    const tokenInDb = yield token_service_1.default.getToken({
        email,
        type: user_interface_1.ITokenTypes.passwordResetToken,
    });
    const user = yield user_service_1.default.getByEmail(email);
    if (tokenInDb) {
        const newToken = (0, crypto_1.randomBytes)(32).toString("hex");
        console.log(newToken);
        yield token_service_1.default.updateToken({ email, type: user_interface_1.ITokenTypes.passwordResetToken }, newToken);
        yield (0, mailer_1.default)({
            to: email,
            subject: "Forgot Password Verification Link",
            html: (0, requestPasswordEmail_1.resetPasswordHTML)(user, newToken),
        });
    }
    else {
        const newToken = yield token_service_1.default.createToken({
            email,
            type: user_interface_1.ITokenTypes.passwordResetToken,
        });
        yield (0, mailer_1.default)({
            to: email,
            subject: "Forgot Password Verification Link",
            html: (0, requestPasswordEmail_1.resetPasswordHTML)(user, newToken.value),
        });
    }
});
const resetPassword = (token, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, confirmPassword } = body;
    if (password !== confirmPassword) {
        throw new errors_1.BadRequestError("Passwords do not match");
    }
    /**
     * Get the user from the token and update their password
     */
    const tokenInDb = yield token_service_1.default.getToken({
        value: token,
        type: user_interface_1.ITokenTypes.passwordResetToken,
    });
    if (!tokenInDb) {
        throw new errors_1.NotFoundError("Token does not exist or has expired, kindly request the link again");
    }
    const newPassword = yield argon2_1.default.hash(password);
    yield user_auth_model_1.default.findOneAndUpdate({ email: tokenInDb.email }, { password: newPassword });
    yield token_service_1.default.deleteToken({ _id: tokenInDb._id });
});
const authService = {
    getById,
    getByEmail,
    createAccount,
    verifyAccount,
    login,
    requestForgotPasswordLink,
    resetPassword,
};
exports.default = authService;
