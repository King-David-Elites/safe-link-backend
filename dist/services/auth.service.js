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
const emails_1 = require("../templates/emails");
const token_service_1 = __importDefault(require("./token.service"));
const jwt_1 = __importDefault(require("../helpers/jwt"));
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
    const { email, firstName, lastName, 
    // about,
    // websiteUrl,
    // facebookUrl,
    // profilePicture,
    // professionalPictures,
    // workPictures,
    // leisurePictures,
    // address,
    // state,
    // city,
    // zipCode,
    phoneNumber1, 
    // phoneNumber2,
    // instagramUrl,
    // country,
    password, confirmPassword, } = body;
    if (password != confirmPassword) {
        throw new errors_1.BadRequestError("Passwords do not match");
    }
    const auth = yield user_auth_model_1.default.create({ email, password });
    const user = yield user_model_1.default.create({
        email,
        firstName,
        lastName,
        // about,
        // websiteUrl,
        // facebookUrl,
        // instagramUrl,
        // profilePicture,
        // professionalPictures,
        // workPictures,
        // leisurePictures,
        // address,
        // country,
        // state,
        // city,
        // zipCode,
        phoneNumber1,
        // phoneNumber2,
    });
    const token = yield token_service_1.default.createToken({
        email,
        type: user_interface_1.ITokenTypes.accountVerificationToken,
    });
    yield (0, mailer_1.default)({
        to: email,
        subject: "CREAM CARD ACCOUNT VERIFICATION",
        html: (0, emails_1.verifyEmailHTML)(user, token.value),
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
            html: (0, emails_1.verifyEmailHTML)(user, token),
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
const authService = {
    createAccount,
    verifyAccount,
    login,
};
exports.default = authService;
