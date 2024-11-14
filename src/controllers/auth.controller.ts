import { NextFunction, Request, Response } from 'express';
import authService from '../services/auth.service';
import { IAuth } from '../interfaces/models/user.interface';
import { IResetPasswordReq } from '../interfaces/responses/auth.response';

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, confirmPassword, username } = req.body;

    await authService.createAccount({
      email,
      password,
      confirmPassword,
      username,
    });

    res.status(201).json({ message: 'Verification email sent', data: null });
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

    res.status(200).json({ message: 'Account verified successfully' });
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
      message: 'Login successful',
      data: { accessToken: data.accessToken, user: data.user },
    });
  } catch (error) {
    return next(error);
  }
};

const requestForgotPasswordLink = async (
  req: Request<{}, {}, { email: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    await authService.requestForgotPasswordLink(email);

    res.status(200).json({
      message: 'Password reset link sent successfully',
      data: null,
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (
  req: Request<{}, {}, IResetPasswordReq>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, confirmPassword, token } = req.body;

    await authService.resetPassword(token, { password, confirmPassword });

    res
      .status(200)
      .json({ message: 'Password reset successfully', data: null });
  } catch (error) {
    return next(error);
  }
};

const authController = {
  register,
  verifyAccount,
  login,
  requestForgotPasswordLink,
  resetPassword,
};

export default authController;
