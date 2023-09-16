import { config } from "dotenv";

config();

const settings = {
  mongoDbUrl: <string>process.env.MONGODB_URL,
  cloudinary: {
    cloudName: <string>process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: <string>process.env.CLOUDINARY_API_KEY,
    apiSecret: <string>process.env.CLOUDINARY_API_SECRET,
  },
};

export default settings;
