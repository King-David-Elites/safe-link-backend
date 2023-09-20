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
const user_token_model_1 = __importDefault(require("../models/user.token.model"));
const errors_1 = require("../constants/errors");
const createToken = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, type } = body;
    const token = yield user_token_model_1.default.create({ email, type });
    return token;
});
const updateToken = (query, token) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenInDb = yield user_token_model_1.default.findOneAndUpdate(query, { value: token });
    if (!tokenInDb) {
        throw new errors_1.NotFoundError("token does not exist");
    }
    return tokenInDb;
});
const getToken = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield user_token_model_1.default.findOne(query);
    if (!token) {
        throw new errors_1.NotFoundError("Token does not exist");
    }
    return token;
});
const deleteToken = (query) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_token_model_1.default.findOneAndDelete(query);
});
const tokenService = {
    createToken,
    updateToken,
    getToken,
    deleteToken,
};
exports.default = tokenService;
