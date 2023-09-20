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
    email: <string>process.env.EMAIL_ADDRESS,
    password: <string>process.env.EMAIL_TEST_PASSWORD,
  },
  frontendUrl: <string>process.env.FRONTEND_URL,
  accessTokenSecret: <string>process.env.ACCESS_TOKEN_SECRET,
};

export default settings;
