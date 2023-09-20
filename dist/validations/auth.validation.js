"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginInput = exports.VerifyEmailInput = exports.SignUpInput = void 0;
const yup_1 = require("yup");
exports.SignUpInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)().email().required(),
        firstName: (0, yup_1.string)().required(),
        lastName: (0, yup_1.string)().required(),
        phoneNumber1: (0, yup_1.string)().required(),
        password: (0, yup_1.string)().required().min(8),
        confirmPassword: (0, yup_1.string)().required().min(8),
    }),
});
exports.VerifyEmailInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        token: (0, yup_1.string)().required(),
    }),
});
exports.LoginInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)().email().required(),
        password: (0, yup_1.string)().required().min(8),
    }),
});
