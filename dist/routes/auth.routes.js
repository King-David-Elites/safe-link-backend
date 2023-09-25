"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validations_1 = __importDefault(require("../validations"));
const auth_validation_1 = require("../validations/auth.validation");
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = (0, express_1.Router)();
router.post("/register", (0, validations_1.default)(auth_validation_1.SignUpInput), auth_controller_1.default.register);
router.post("/login", (0, validations_1.default)(auth_validation_1.LoginInput), auth_controller_1.default.login);
router.patch("/verify-account", (0, validations_1.default)(auth_validation_1.VerifyEmailInput), auth_controller_1.default.verifyAccount);
router.patch("/change-password", isAuth_1.default, (0, validations_1.default)(auth_validation_1.ChangePasswordInput), user_controller_1.default.changePassword);
router.post("/reset-password/link", (0, validations_1.default)(auth_validation_1.RequestPasswordResetLinkInput), auth_controller_1.default.requestForgotPasswordLink);
router.patch("/reset-password", (0, validations_1.default)(auth_validation_1.ResetPasswordInput), auth_controller_1.default.resetPassword);
exports.default = router;
