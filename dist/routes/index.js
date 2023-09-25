"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_routes_1 = __importDefault(require("./auth.routes"));
const questions_routes_1 = __importDefault(require("./questions.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const inventory_routes_1 = __importDefault(require("./inventory.routes"));
const routes = {
    auth: auth_routes_1.default,
    questions: questions_routes_1.default,
    user: user_routes_1.default,
    inventory: inventory_routes_1.default,
};
exports.default = routes;
