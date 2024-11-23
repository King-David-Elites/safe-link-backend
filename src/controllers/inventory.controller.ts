import { NextFunction, Request, Response } from "express";
import { IRequest } from "../interfaces/expressRequest";
import { upload } from "../helpers/upload";
import { BadRequestError } from "../constants/errors";
import inventoryService from "../services/inventory.service";

const addToInventory = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const owner = <string>req.userId;
    let { price, currency, title, description, cover, images, videos } =
      req.body;

    videos = await Promise.all(
      videos.map((video: string) => upload(video, { resource_type: "video" }))
    );

    images = await Promise.all(images.map((image: string) => upload(image)));

    cover = cover && (await upload(cover));

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
    console.log({ owner, inventoryId });

    if (req.body.images && req.body.images.length > 0) {
      req.body.images = await Promise.all(
        req.body.images.map((img: string) => upload(img))
      );
    }

    if (req.body.videos && req.body.videos.length > 0) {
      req.body.videos = await Promise.all(
        req.body.videos.map((vid: string) => upload(vid))
      );
    }

    if (req.body.cover) {
      req.body.cover = await upload(req.body.cover);
    }

    const data = await inventoryService.editInventory(owner, {
      ...req.body,
      _id: inventoryId,
    });

    res.status(200).json({ message: "Inventory edited successfully", data });
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

const inventoryControllers = {
  getSingleInventory,
  getUserInventories,
  getMyInventories,
  editInventory,
  addToInventory,
  deleteInventory,
};

export default inventoryControllers;
