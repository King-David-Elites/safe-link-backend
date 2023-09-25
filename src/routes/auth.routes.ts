import { Router } from "express";
import authController from "../controllers/auth.controller";
import validate from "../validations";
import {
  ChangePasswordInput,
  LoginInput,
  RequestPasswordResetLinkInput,
  ResetPasswordInput,
  SignUpInput,
  VerifyEmailInput,
} from "../validations/auth.validation";
import userController from "../controllers/user.controller";
import isAuth from "../middleware/isAuth";

const router = Router();

router.post("/register", validate(SignUpInput), authController.register);
router.post("/login", validate(LoginInput), authController.login);
router.patch(
  "/verify-account",
  validate(VerifyEmailInput),
  authController.verifyAccount
);
router.patch(
  "/change-password",
  isAuth,
  validate(ChangePasswordInput),
  userController.changePassword
);

router.post(
  "/reset-password/link",
  validate(RequestPasswordResetLinkInput),
  authController.requestForgotPasswordLink
);

router.patch(
  "/reset-password",
  validate(ResetPasswordInput),
  authController.resetPassword
);

export default router;
