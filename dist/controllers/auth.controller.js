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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, phoneNumber1, password, confirmPassword, } = req.body;
        yield auth_service_1.default.createAccount({
            email,
            firstName,
            lastName,
            password,
            confirmPassword,
        });
        res.status(201).json({ message: "Verification email sent", data: null });
    }
    catch (error) {
        return next(error);
    }
});
const verifyAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const data = yield auth_service_1.default.verifyAccount(token);
        res.status(200).json({ message: "Account verified successfully" });
    }
    catch (error) {
        return next(error);
    }
});
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const data = yield auth_service_1.default.login({ email, password });
        res.status(200).json({
            message: "Login successful",
            data: { accessToken: data.accessToken, user: data.user },
        });
    }
    catch (error) {
        return next(error);
    }
});
const authController = {
    register,
    verifyAccount,
    login,
};
exports.default = authController;
