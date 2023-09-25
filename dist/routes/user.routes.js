"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const validations_1 = __importDefault(require("../validations"));
const user_validation_1 = require("../validations/user.validation");
const router = (0, express_1.Router)();
router
    .route("/")
    .get(isAuth_1.default, user_controller_1.default.getMyInfo)
    .put(isAuth_1.default, (0, validations_1.default)(user_validation_1.EditUserInput), user_controller_1.default.editUser)
    .delete(isAuth_1.default, user_controller_1.default.deleteUser);
router.route("/:email").get(user_controller_1.default.getUserByEmail);
exports.default = router;
