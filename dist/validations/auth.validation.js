"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordInput = exports.RequestPasswordResetLinkInput = exports.ChangePasswordInput = exports.LoginInput = exports.VerifyEmailInput = exports.SignUpInput = void 0;
const yup_1 = require("yup");
exports.SignUpInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)().email().required(),
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
exports.ChangePasswordInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        oldPassword: (0, yup_1.string)().required("Old Password is required").min(8),
        newPassword: (0, yup_1.string)().required("New Password is required").min(8),
        confirmNewPassword: (0, yup_1.string)()
            .required("Confirm new password is required")
            .min(8),
    }),
});
exports.RequestPasswordResetLinkInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)().email().required(),
    }),
});
exports.ResetPasswordInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        token: (0, yup_1.string)().required(),
        password: (0, yup_1.string)().required("Password is required").min(8),
        confirmPassword: (0, yup_1.string)().required().min(8),
    }),
});
