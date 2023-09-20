"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const validations_1 = __importDefault(require("../validations"));
const auth_validation_1 = require("../validations/auth.validation");
const router = (0, express_1.Router)();
router.post("/register", (0, validations_1.default)(auth_validation_1.SignUpInput), auth_controller_1.default.register);
router.post("/login", (0, validations_1.default)(auth_validation_1.LoginInput), auth_controller_1.default.login);
router.patch("/verify-account", (0, validations_1.default)(auth_validation_1.VerifyEmailInput), auth_controller_1.default.verifyAccount);
exports.default = router;
