import { NextFunction, Request, Response } from "express";
import authService from "../services/auth.service";
import { IAuth } from "../interfaces/models/user.interface";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      email,
      firstName,
      lastName,

      phoneNumber1,
      password,
      confirmPassword,
    } = req.body;

    await authService.createAccount({
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
    });

    res.status(201).json({ message: "Verification email sent", data: null });
  } catch (error) {
    return next(error);
  }
};

const verifyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.body.token;

    const data = await authService.verifyAccount(token);

    res.status(200).json({ message: "Account verified successfully" });
  } catch (error) {
    return next(error);
  }
};

const login = async (
  req: Request<{}, {}, Partial<IAuth>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const data = await authService.login({ email, password });

    res.status(200).json({
      message: "Login successful",
      data: { accessToken: data.accessToken, user: data.user },
    });
  } catch (error) {
    return next(error);
  }
};

const authController = {
  register,
  verifyAccount,
  login,
};

export default authController;
