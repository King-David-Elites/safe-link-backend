import { NextFunction, Request, Response } from "express";
import { IRequest } from "../interfaces/expressRequest";
// import { upload } from "../helpers/upload";
import { BadRequestError } from "../constants/errors";
import inventoryService from "../services/inventory.service";
import axios from "axios";
import { uploader } from "../utils/uploader";

const addToInventory = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = <string>req.userId;
    let { price, currency, title, description, cover, images, videos } =
      req.body;

    videos = await Promise.all(videos.map((video: string) => uploader(video)));

    // images = await Promise.all(images.map((image: string) => upload(image)));

    // cover = cover && (await upload(cover));

    const data = await inventoryService.createInventory({
      title,
      description,
      price,
      currency,
      images,
      videos,
      owner,
      cover,
    });

    res.status(201).json({
      message: "Inventory created successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const editInventory = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = <string>req.userId;
    const inventoryId = req.params.id;
    // console.log({ owner, inventoryId });

    if (req.body.images && req.body.images.length > 0) {
      req.body.images = await Promise.all(
        req.body.images.map((img: string) => uploader(img))
      );
    }

    if (req.body.videos && req.body.videos.length > 0) {
      req.body.videos = await Promise.all(
        req.body.videos.map((vid: string) => uploader(vid))
      );
    }

    if (req.body.cover) {
      req.body.cover = await uploader(req.body.cover);
    }

    const allImages = [
      ...new Set([...req.body.images, ...req.body.existingImages]),
    ];

    const data = await inventoryService.editInventory(owner, {
      ...req.body,
      _id: inventoryId,
      images: allImages,
    });

    res.status(200).json({ message: "Inventory edited successfully", data });
    try {
      await axios.post("https://safelink.up.railway.app/add_inventory_to_ai", {
        inventory_id: data._id, // Send the created inventory ID
      });
      console.log("Inventory ID sent to AI training service");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Failed to notify AI training service:", error.message);
      } else {
        console.error("Failed to notify AI training service:", error);
      }
    }
  } catch (error) {
    return next(error);
  }
};

const deleteInventory = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = <string>req.userId;
    const inventoryId = req.params.id;

    await inventoryService.deleteInventory(userId, inventoryId);

    res
      .status(200)
      .json({ message: "Inventory deleted successfully", data: null });
  } catch (error) {
    return next(error);
  }
};

const getMyInventories = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = <string>req.userId;

    const data = await inventoryService.getUserInventories(userId);

    res.status(200).json({ message: "Inventories fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUserInventories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = <string>req.params.id;

    const data = await inventoryService.getUserInventories(userId);

    res.status(200).json({ message: "Inventories fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getSingleInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const inventoryId = req.params.id;

  try {
    const data = await inventoryService.getSingleInventory(inventoryId);

    res.status(200).json({ message: "Inventory fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUsersWithNonFreePlansAndNoListings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users =
      await inventoryService.getUsersWithNonFreePlansAndNoListings();
    res
      .status(200)
      .json({ message: "Users fetched successfully", data: users });
  } catch (error) {
    return next(error);
  }
};

const inventoryControllers = {
  getSingleInventory,
  getUserInventories,
  getMyInventories,
  editInventory,
  addToInventory,
  deleteInventory,
  getUsersWithNonFreePlansAndNoListings,
};

export default inventoryControllers;
