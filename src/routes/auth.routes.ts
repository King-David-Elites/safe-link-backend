import { Router } from "express";
import authController from "../controllers/auth.controller";
import validate from "../validations";
import {
  LoginInput,
  SignUpInput,
  VerifyEmailInput,
} from "../validations/auth.validation";

const router = Router();

router.post("/register", validate(SignUpInput), authController.register);
router.post("/login", validate(LoginInput), authController.login);
router.patch(
  "/verify-account",
  validate(VerifyEmailInput),
  authController.verifyAccount
);

export default router;
