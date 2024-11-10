import { NextFunction, Request, Response } from 'express';
import otpService from '../services/otp.service';
import userService from '../services/user.service';
import { IRequest } from '../interfaces/expressRequest';

const generateOtp = async (req: IRequest, res: Response, next: NextFunction) => {
  const userId = <string>req.userId;

  try {
    const user = await userService.getById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = await otpService.generateOtp(userId, user.phoneNumber);
    res.status(200).json({ message: 'OTP sent successfully', otp });
  } catch (error) {
    return next(error);
  }
};

const verifyOtp = async (req: IRequest, res: Response, next: NextFunction) => {
  const { otp } = req.body;
  const userId = <string>req.userId;

  try {
    const isValid = await otpService.verifyOtp(userId, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await userService.editUser({ _id: userId, isVerified: true });
    res.status(200).json({ message: 'User verified successfully' });
  } catch (error) {
    return next(error);
  }
};

const resendOtp = async (req: IRequest, res: Response, next: NextFunction) => {
  const userId = <string>req.userId;

  try {
    const user = await userService.getById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    const otp = await otpService.generateOtp(userId, user.phoneNumber);
    res.status(200).json({ message: 'OTP resent successfully', otp });
  } catch (error) {
    return next(error);
  }
};

const otpController = {
  generateOtp,
  verifyOtp,
  resendOtp,
};

export default otpController;
