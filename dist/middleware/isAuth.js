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
const jwt_1 = __importDefault(require("../helpers/jwt"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_service_1 = __importDefault(require("../services/user.service"));
const isAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new errors_1.UnAuthenticatedError("Provide auth token in this format `Bearer ${token}`");
        }
        const token = yield authHeader.split(" ")[1];
        if (!token) {
            throw new errors_1.UnAuthenticatedError("Provide token");
        }
        const userToken = yield jwt_1.default.verifyJWT(token);
        if (!userToken) {
            throw new errors_1.UnAuthenticatedError("Token does not exist or has expired");
        }
        const userAuth = yield auth_service_1.default.getById(userToken.userId);
        const user = yield user_service_1.default.getByEmail(userAuth.email);
        req.userId = user._id;
        next();
    }
    catch (error) {
        return next(error);
    }
});
exports.default = isAuth;
