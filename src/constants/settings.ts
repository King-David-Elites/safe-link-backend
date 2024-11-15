import { config } from "dotenv";

config();

const settings = {
  mongoDbUrl: <string>process.env.MONGODB_URL,
  cloudinary: {
    cloudName: <string>process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: <string>process.env.CLOUDINARY_API_KEY,
    apiSecret: <string>process.env.CLOUDINARY_API_SECRET,
  },
  nodemailer: {
    email: <string>process.env.SAFELINK_EMAIL_ADDRESS,
    password: <string>process.env.SAFELINK_EMAIL_PASSWORD,
  },
  frontendUrl: <string>process.env.FRONTEND_URL,
  accessTokenSecret: <string>process.env.ACCESS_TOKEN_SECRET,
  backendUrl: <string>process.env.SERVER_URL,
};
console.log("MongoDB URL:", process.env.MONGODB_URL);

export default settings;
