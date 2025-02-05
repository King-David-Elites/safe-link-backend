import { v2 as cloudinary } from "cloudinary";
import settings from "../constants/settings";
import path from "path";
import fs from "fs/promises";

require("dotenv").config();

cloudinary.config({
  cloud_name: settings.cloudinary.cloudName,
  api_key: settings.cloudinary.apiKey,
  api_secret: settings.cloudinary.apiSecret,
});

export const uploader = async (data: string) => {
  let url = (await cloudinary.uploader.upload(data)).secure_url;
  return url;
};
const baseURL = process.env.SAFELINK_BACKEND_BASE_URL;

// export const uploader = async (base64Data: string): Promise<string> => {
//   const matches = base64Data.match(/^data:(image|video)\/(\w+);base64,(.+)$/);
//   console.log(base64Data.slice(0, 50)); // To inspect initial data
//   if (!matches || matches.length !== 4) {
//     throw new Error("Invalid base64 media data");
//   }

//   const mediaType = matches[1]; // "image" or "video"
//   const extension = matches[2]; // File extension (png, jpg, mp4, etc.)
//   const base64MediaData = matches[3]; // Extracted base64 data
//   const buffer = Buffer.from(base64MediaData, "base64");

//   const fileName = `${Date.now()}-${mediaType}-upload.${extension}`;
//   const uploadPath = path.join("uploads", fileName); // Save to "uploads" folder

//   await fs.writeFile(uploadPath, buffer);

//   return `${baseURL}/uploads/${fileName}`; // Return URL path
// };

export const uploaderListOfMedia = async (arr: any) => {
  let newArr = [];

  for (let i = 0; i < arr.length; i++) {
    newArr.push(await uploader(arr[i]));
  }
  return newArr;
};

export const uploadVideos = async (arr: any) => {
  let newArr = [];

  for (let i = 0; i < arr.length; i++) {
    newArr.push(
      (
        await cloudinary.uploader.upload(arr[i] as string, {
          resource_type: "video",
          format: "mp4",
        })
      ).secure_url
    );
  }
  return newArr;
};

export const conditionalSingleUpload = async (
  newMedia: string | undefined,
  currentMedia: string,
  uploaderFn: (media: string) => Promise<string>
): Promise<string> => {
  if (!newMedia || newMedia === currentMedia) {
    return currentMedia; // No changes needed
  }
  return await uploaderFn(newMedia); // Upload and return new media URL
};

export const conditionalArrayUpload = async (
  newMedia: string[] | undefined,
  currentMedia: string[],
  uploaderListFn: (media: string[]) => Promise<string[]>
): Promise<string[]> => {
  if (!newMedia || JSON.stringify(newMedia) === JSON.stringify(currentMedia)) {
    return currentMedia; // No changes needed
  }
  return await uploaderListFn(newMedia); // Upload and return new media URLs
};

export default cloudinary;
