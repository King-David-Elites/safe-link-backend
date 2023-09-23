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
    const { price, currency, title, description } = req.body;

    req.files = [...((req.files || []) as Express.Multer.File[])];

    const imagesUpload = req.files?.filter((file) =>
      file.mimetype.includes("image")
    );
    const videosUpload = req.files?.filter((file) =>
      file.mimetype.includes("video")
    );

    if (imagesUpload.length === 0 || videosUpload.length === 0) {
      return next(new BadRequestError("Provide at lease one image & video"));
    }

    let images: string[] = [];
    let videos: string[] = [];

    for (const image of imagesUpload) {
      const url = await upload(image.path);

      images.push(url);
    }

    for (const video of videosUpload) {
      const url = await upload(video.path, {
        format: "mp4",
        resource_type: "video",
      });

      videos.push(url);
    }

    const data = await inventoryService.createInventory({
      title,
      description,
      price,
      currency,
      images,
      videos,
      owner,
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

    const { title, description, price, currency } = req.body;

    // set them to undefined first instead of empty array so an empty array  won't be added to the DB

    let images: string[] | undefined;
    let videos: string[] | undefined;

    if ((req.files?.length as number) > 0) {
      req.files = [...((req.files || []) as Express.Multer.File[])];

      const imagesUpload = req.files?.filter((file) =>
        file.mimetype.includes("image")
      );
      const videosUpload = req.files?.filter((file) =>
        file.mimetype.includes("video")
      );

      //  initialize the arrays
      if (imagesUpload.length > 0) {
        images = [];

        for (const image of imagesUpload) {
          const url = await upload(image.path);

          images.push(url);
        }
      }

      if (videosUpload.length > 0) {
        videos = [];

        for (const video of videosUpload) {
          const url = await upload(video.path, {
            format: "mp4",
            resource_type: "video",
          });

          videos.push(url);
        }
      }
    }

    const data = await inventoryService.editInventory(owner, {
      images,
      videos,
      title,
      description,
      price,
      currency,
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
