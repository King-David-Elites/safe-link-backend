import { object, string } from "yup";

export const SignUpInput = object({
  body: object({
    email: string().email().required(),
    firstName: string().required(),
    lastName: string().required(),
    phoneNumber1: string().required(),
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
