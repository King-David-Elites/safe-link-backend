"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.multerUploader = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const settings_1 = __importDefault(require("../constants/settings"));
const errors_1 = require("../constants/errors");
const fs_1 = __importDefault(require("fs"));
const multerConfig = {
    storage: multer_1.default.diskStorage({
        filename: (req, file, cb) => {
            let fileName = file.originalname;
            // add a uuid before the extension
            fileName = fileName.split(".");
            fileName[fileName.length - 2] = fileName[fileName.length - 2] + (0, uuid_1.v4)();
            fileName = fileName.join(".");
            cb(null, `${fileName}`);
        },
        destination: (req, file, cb) => {
            cb(null, path_1.default.join(__dirname, "../uploads"));
        },
    }),
};
exports.multerUploader = (0, multer_1.default)(multerConfig);
// cloudinary config
cloudinary_1.v2.config({
    api_key: settings_1.default.cloudinary.apiKey,
    api_secret: settings_1.default.cloudinary.apiSecret,
    cloud_name: settings_1.default.cloudinary.cloudName,
});
const upload = (filePath, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFile = yield cloudinary_1.v2.uploader.upload(filePath, Object.assign({ folder: "CREAM CARD RESOURCES" }, options));
        yield fs_1.default.unlink(filePath, () => { });
        return uploadedFile.url;
    }
    catch (error) {
        throw new errors_1.BadRequestError(error);
    }
});
exports.upload = upload;
