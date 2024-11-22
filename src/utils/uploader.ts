import { v2 as cloudinary } from "cloudinary";
import settings from "../constants/settings";

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
