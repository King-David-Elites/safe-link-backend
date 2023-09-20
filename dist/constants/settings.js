"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const settings = {
    mongoDbUrl: process.env.MONGODB_URL,
    cloudinary: {
        cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.CLOUDINARY_API_KEY,
        apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    nodemailer: {
        email: process.env.EMAIL_ADDRESS,
        password: process.env.EMAIL_TEST_PASSWORD,
    },
    frontendUrl: process.env.FRONTEND_URL,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
};
exports.default = settings;
