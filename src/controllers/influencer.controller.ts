// controller/influencer.controller.ts
import { Request, Response } from "express";
import influencerService from "../services/influencer.service";

const createInfluencer = async (req: Request, res: Response) => {
  try {
    const { name, referralCode } = req.body;

    // Ensure both name and referralCode are provided
    if (!name || !referralCode) {
      return res.status(400).json({
        success: false,
        message: "Name and referralCode are required.",
      });
    }

    // Call service with correct parameters
    const influencer = await influencerService.createInfluencer({ name, referralCode });

    res.status(201).json({
      success: true,
      message: "Influencer created successfully",
      data: influencer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const influencerController = {
  createInfluencer,
};

export default influencerController;
