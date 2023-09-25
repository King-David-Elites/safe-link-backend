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
const user_service_1 = __importDefault(require("../services/user.service"));
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, oldPassword, confirmNewPassword } = req.body;
    const userId = req.userId;
    try {
        yield user_service_1.default.changePassword({
            userId,
            newPassword,
            oldPassword,
            confirmNewPassword,
        });
        res
            .status(200)
            .json({ message: "Password Changed Successfully", data: null });
    }
    catch (error) {
        return next(error);
    }
});
const editUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.userId;
        const data = yield user_service_1.default.editUser(Object.assign(Object.assign({}, req.body), { _id }));
        return res
            .status(200)
            .json({ message: "Profile updated successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const getMyInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const data = yield user_service_1.default.getById(userId);
        res.status(200).json({ message: "User Info fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const getUserByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.params.email;
        const data = yield user_service_1.default.getByEmail(email);
        res.status(200).json({ message: "User Info fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        yield user_service_1.default.deleteUser(userId);
        res.status(200).json({ message: "User profile deleted successfully" });
    }
    catch (error) {
        return next(error);
    }
});
const userController = {
    changePassword,
    editUser,
    deleteUser,
    getMyInfo,
    getUserByEmail,
};
exports.default = userController;
