import { v2 as cloudinary } from "cloudinary";

require("dotenv").config()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
  });

export const uploader = async (data: string) => {

    let url = (await cloudinary.uploader.upload(data)).secure_url;
    return url
}

export const uploaderListOfMedia = async (arr: any) => {
    let newArr = [];

    for (let i = 0; i < arr.length; i++) {
        newArr.push(await uploader(arr[i]));
    }
    return newArr;
}

export  const uploadVideos = async (arr: any)=>{
    let newArr = [];

    for (let i = 0; i < arr.length; i++) {
        newArr.push((
            await cloudinary.uploader.upload(arr[i] as string, {
              resource_type: "video",
              format: "mp4",
            })
          ).secure_url);
    }
    return newArr;
}

export default cloudinary;