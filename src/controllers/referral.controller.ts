import { Response, NextFunction } from "express";
import referralService from "../services/referral.services";
import { IRequest } from "../interfaces/expressRequest";

const getCurrentMonthreferrals = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await referralService.getReferralsByInfluencers();
    return res
      .status(200)
      .json({ message: "influencers referrals fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const referralControllers = {
  getCurrentMonthreferrals,
};

export default referralControllers;
