import { Response, NextFunction } from "express";
import referralService from "../services/referral.services";
import { IRequest } from "../interfaces/expressRequest";
import Referral from "../models/referral.model";
import { generateUniqueReferralCode } from "../helpers/generateUniqueReferralCode";

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

const createReferral = async (req: IRequest, res: Response) => {
  try {
    const userId = req.userId; // Assuming you have user data in request from auth middleware

    // Check if user already has a referral record
    const existingReferral = await Referral.findOne({ user: userId });
    if (existingReferral) {
      return res.status(400).json({
        success: false,
        message: "Referral account already exists for this user",
      });
    }

    // Generate unique referral code
    const referralCode = await generateUniqueReferralCode();

    const referralData = {
      ...req.body,
      user: userId,
      referralCode,
      referralLink: `https://joinsafelink.com/signup?code=${referralCode}`,
    };

    const referral = await Referral.create(referralData);

    return res.status(201).json({
      success: true,
      message: "Referral account created successfully",
      data: referral,
    });
  } catch (error: any) {
    console.error("Create referral error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating referral account",
      error: error.message,
    });
  }
};

const updateReferral = async (req: IRequest, res: Response) => {
  try {
    const userId = req.userId; // Assuming you have user data in request from auth middleware

    // Find and update the referral
    const updatedReferral = await Referral.findOneAndUpdate(
      { user: userId },
      {
        $set: {
          ...req.body,
          // Prevent updating certain fields
          referralCode: undefined,
          user: undefined,
          totalEarnings: undefined,
        },
      },
      { new: true }
    );

    if (!updatedReferral) {
      return res.status(404).json({
        success: false,
        message: "Referral account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Referral account updated successfully",
      data: updatedReferral,
    });
  } catch (error: any) {
    console.error("Update referral error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating referral account",
      error: error.message,
    });
  }
};

// ... existing code ...

const getReferral = async (req: IRequest, res: Response) => {
  try {
    const userId = req.userId;

    const referral = await Referral.findOne({ user: userId });

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Referral account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Referral account retrieved successfully",
      data: referral,
    });
  } catch (error: any) {
    console.error("Get referral error:", error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving referral account",
      error: error.message,
    });
  }
};

const referralControllers = {
  getCurrentMonthreferrals,
  createReferral,
  updateReferral,
  getReferral, // Add the new controller to the export object
};

export default referralControllers;
