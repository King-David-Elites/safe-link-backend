import { object, string } from "yup";

export const SignUpInput = object({
  body: object({
    username: string().required(),
    email: string().email().required(),
    password: string().required().min(8),
    confirmPassword: string().required().min(8),
  }),
});

export const VerifyEmailInput = object({
  body: object({
    token: string().required(),
  }),
});

export const LoginInput = object({
  body: object({
    email: string().email().required(),
    password: string().required().min(8),
  }),
});

export const ChangePasswordInput = object({
  body: object({
    oldPassword: string().required("Old Password is required").min(8),
    newPassword: string().required("New Password is required").min(8),
    confirmNewPassword: string()
      .required("Confirm new password is required")
      .min(8),
  }),
});

export const RequestPasswordResetLinkInput = object({
  body: object({
    email: string().email().required(),
  }),
});

export const ResetPasswordInput = object({
  body: object({
    token: string().required(),
    password: string().required("Password is required").min(8),
    confirmPassword: string().required().min(8),
  }),
});
