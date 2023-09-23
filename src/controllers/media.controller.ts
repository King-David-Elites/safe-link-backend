/*
    for uploading images and videos
*/

import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../constants/errors";
import { UploadApiOptions } from "cloudinary";
import { upload } from "../helpers/upload";

const handleMediaUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const file = <Express.Multer.File>req.file;

    if (!file) {
      throw new BadRequestError("Provide file");
    }

    const options: UploadApiOptions = {};

    // add format and resource_type if it's a video
    if (file.mimetype.includes("video")) {
      options.resource_type = "video";
      options.format = "mp4";
    }

    const url = await upload(file.path, options);

    return res.status(200).json({ data: url });
  } catch (error: any) {
    return next(error);
  }
};

export default handleMediaUpload;
