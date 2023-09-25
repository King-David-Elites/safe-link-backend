"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const inventory_validation_1 = require("../validations/inventory.validation");
const validations_1 = __importDefault(require("../validations"));
const inventory_controller_1 = __importDefault(require("../controllers/inventory.controller"));
const upload_1 = require("../helpers/upload");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(isAuth_1.default, upload_1.multerUploader.array("media"), (0, validations_1.default)(inventory_validation_1.CreateInventoryInput), inventory_controller_1.default.addToInventory)
    .get(isAuth_1.default, inventory_controller_1.default.getMyInventories);
router
    .route("/:id")
    .put(isAuth_1.default, (0, validations_1.default)(inventory_validation_1.EditInventoryInput), upload_1.multerUploader.array("media"), inventory_controller_1.default.editInventory)
    .delete(isAuth_1.default, inventory_controller_1.default.deleteInventory)
    .get(inventory_controller_1.default.getSingleInventory);
router.route("/user/:id").get(inventory_controller_1.default.getUserInventories);
exports.default = router;
