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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = __importDefault(require("../constants/settings"));
class JWT {
    constructor() {
        this.decodeSecret = () => __awaiter(this, void 0, void 0, function* () {
            const secret = yield Buffer.from(settings_1.default.accessTokenSecret, "base64").toString("ascii");
            return secret;
        });
        this.signJWT = (userId) => __awaiter(this, void 0, void 0, function* () {
            const token = yield jsonwebtoken_1.default.sign({ userId }, yield this.decodeSecret(), {
                expiresIn: "1y",
            });
            return token;
        });
        this.verifyJWT = (token) => __awaiter(this, void 0, void 0, function* () {
            const decodedToken = yield jsonwebtoken_1.default.verify(token, yield this.decodeSecret());
            return decodedToken;
        });
    }
}
const JWTHelper = new JWT();
exports.default = JWTHelper;