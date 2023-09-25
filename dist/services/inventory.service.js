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
const errors_1 = require("../constants/errors");
const inventory_model_1 = __importDefault(require("../models/inventory.model"));
const createInventory = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, currency, owner, images, videos } = body;
    return yield inventory_model_1.default.create({
        title,
        description,
        price,
        currency,
        owner,
        images,
        videos,
    });
});
const getUserInventories = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield inventory_model_1.default.find({ owner: userId });
});
const deleteInventory = (userId, inventoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const inventory = yield inventory_model_1.default.findById(inventoryId);
    if (!inventory)
        throw new errors_1.NotFoundError("Inventory does not exist");
    if (inventory.owner.toString() != userId.toString())
        throw new errors_1.ForbiddenError("Inventory does not belong to you");
    yield inventory.deleteOne();
});
const editInventory = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, price, currency, owner, images, videos } = body;
    const inventory = yield inventory_model_1.default.findById(body._id);
    if (!inventory)
        throw new errors_1.NotFoundError("Inventory does not exist");
    if (inventory.owner.toString() != userId.toString())
        throw new errors_1.ForbiddenError("Inventory does not belong to you");
    inventory.title = title || inventory.title;
    inventory.description = description || inventory.description;
    inventory.price = price || inventory.price;
    inventory.images = images || inventory.images;
    inventory.videos = videos || inventory.videos;
    return yield inventory.save();
});
const getSingleInventory = (inventoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const inventory = yield inventory_model_1.default.findById(inventoryId);
    if (!inventory)
        throw new errors_1.NotFoundError("Inventory does not exist");
    return inventory;
});
const inventoryService = {
    getUserInventories,
    editInventory,
    deleteInventory,
    createInventory,
    getSingleInventory,
};
exports.default = inventoryService;
