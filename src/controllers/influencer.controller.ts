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

const getAllInfluencers = async (req: Request, res: Response) => {
  try {
    const influencers = await influencerService.getAllInfluencers();

    res.status(200).json({
      success: true,
      message: "Influencers fetched successfully",
      data: influencers,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getInfluencerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const influencer = await influencerService.getInfluencerById(id);

    res.status(200).json({
      success: true,
      message: "Influencer fetched successfully",
      data: influencer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


const updateInfluencer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const influencer = await influencerService.updateInfluencer(id, updates);

    res.status(200).json({
      success: true,
      message: "Influencer updated successfully",
      data: influencer,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteInfluencer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const influencer = await influencerService.deleteInfluencer(id);

    res.status(200).json({
      success: true,
      message: "Influencer deleted successfully",
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
  getAllInfluencers,
  getInfluencerById,
  updateInfluencer,
  deleteInfluencer,
};

export default influencerController;
