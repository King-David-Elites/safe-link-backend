"use strict";
/*
    for uploading images and videos
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../constants/errors");
const upload_1 = require("../helpers/upload");
const handleMediaUpload = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            throw new errors_1.BadRequestError("Provide file");
        }
        const options = {};
        // add format and resource_type if it's a video
        if (file.mimetype.includes("video")) {
            options.resource_type = "video";
            options.format = "mp4";
        }
        const url = yield (0, upload_1.upload)(file.path, options);
        return res.status(200).json({ data: url });
    }
    catch (error) {
        return next(error);
    }
});
exports.default = handleMediaUpload;
