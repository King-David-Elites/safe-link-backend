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
const upload_1 = require("../helpers/upload");
const errors_1 = require("../constants/errors");
const inventory_service_1 = __importDefault(require("../services/inventory.service"));
const addToInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const owner = req.userId;
        const { price, currency, title, description } = req.body;
        req.files = [...(req.files || [])];
        const imagesUpload = (_a = req.files) === null || _a === void 0 ? void 0 : _a.filter((file) => file.mimetype.includes("image"));
        const videosUpload = (_b = req.files) === null || _b === void 0 ? void 0 : _b.filter((file) => file.mimetype.includes("video"));
        if (imagesUpload.length === 0 || videosUpload.length === 0) {
            return next(new errors_1.BadRequestError("Provide at lease one image & video"));
        }
        let images = [];
        let videos = [];
        for (const image of imagesUpload) {
            const url = yield (0, upload_1.upload)(image.path);
            images.push(url);
        }
        for (const video of videosUpload) {
            const url = yield (0, upload_1.upload)(video.path, {
                format: "mp4",
                resource_type: "video",
            });
            videos.push(url);
        }
        const data = yield inventory_service_1.default.createInventory({
            title,
            description,
            price,
            currency,
            images,
            videos,
            owner,
        });
        res.status(201).json({
            message: "Inventory created successfully",
            data,
        });
    }
    catch (error) {
        return next(error);
    }
});
const editInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    try {
        const owner = req.userId;
        const inventoryId = req.params.id;
        const { title, description, price, currency } = req.body;
        // set them to undefined first instead of empty array so an empty array  won't be added to the DB
        let images;
        let videos;
        if (((_c = req.files) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            req.files = [...(req.files || [])];
            const imagesUpload = (_d = req.files) === null || _d === void 0 ? void 0 : _d.filter((file) => file.mimetype.includes("image"));
            const videosUpload = (_e = req.files) === null || _e === void 0 ? void 0 : _e.filter((file) => file.mimetype.includes("video"));
            //  initialize the arrays
            if (imagesUpload.length > 0) {
                images = [];
                for (const image of imagesUpload) {
                    const url = yield (0, upload_1.upload)(image.path);
                    images.push(url);
                }
            }
            if (videosUpload.length > 0) {
                videos = [];
                for (const video of videosUpload) {
                    const url = yield (0, upload_1.upload)(video.path, {
                        format: "mp4",
                        resource_type: "video",
                    });
                    videos.push(url);
                }
            }
        }
        const data = yield inventory_service_1.default.editInventory(owner, {
            images,
            videos,
            title,
            description,
            price,
            currency,
            _id: inventoryId,
        });
        res.status(200).json({ message: "Inventory edited successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const deleteInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const inventoryId = req.params.id;
        yield inventory_service_1.default.deleteInventory(userId, inventoryId);
        res
            .status(200)
            .json({ message: "Inventory deleted successfully", data: null });
    }
    catch (error) {
        return next(error);
    }
});
const getMyInventories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const data = yield inventory_service_1.default.getUserInventories(userId);
        res.status(200).json({ message: "Inventories fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const getUserInventories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const data = yield inventory_service_1.default.getUserInventories(userId);
        res.status(200).json({ message: "Inventories fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const getSingleInventory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const inventoryId = req.params.id;
    try {
        const data = yield inventory_service_1.default.getSingleInventory(inventoryId);
        res.status(200).json({ message: "Inventory fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const inventoryControllers = {
    getSingleInventory,
    getUserInventories,
    getMyInventories,
    editInventory,
    addToInventory,
    deleteInventory,
};
exports.default = inventoryControllers;
