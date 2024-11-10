import { Router } from 'express';
import otpController from '../controllers/otp.controller';
import isAuth from '../middleware/isAuth';

const router = Router();

router.post('/generate', isAuth, otpController.generateOtp);
router.post('/verify', isAuth, otpController.verifyOtp);
router.post('/resend', isAuth, otpController.resendOtp);

export default router;
