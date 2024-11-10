import User from '../models/user.model';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { addMinutes } from 'date-fns';

dotenv.config();

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const generateOtp = async (userId: string, phoneNumber: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = addMinutes(new Date(), 10); // OTP expires in 10 minutes

  await User.findByIdAndUpdate(userId, { otp, otpExpiresAt });

  await twilioClient.messages.create({
    body: `Your OTP is ${otp}`,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${phoneNumber}`,
  });

  return otp;
};

const verifyOtp = async (userId: string, otp: string): Promise<boolean> => {
  const user = await User.findById(userId);

  if (user && user.otp === otp && user.otpExpiresAt && user.otpExpiresAt > new Date()) {
    await User.findByIdAndUpdate(userId, { otp: null, otpExpiresAt: null });
    return true;
  }

  return false;
};

const otpService = {
  generateOtp,
  verifyOtp,
};

export default otpService;
