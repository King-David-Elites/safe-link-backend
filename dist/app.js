"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const server_entry_1 = __importDefault(require("./entry/server.entry"));
const error_handlers_1 = require("./handlers/error.handlers");
const routes_1 = __importDefault(require("./routes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const doc = require("./constants/doc.json");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
const TEN_MINUTES = 1000 * 60 * 10;
app.use((0, express_rate_limit_1.default)({
    windowMs: TEN_MINUTES,
    max: 100,
}));
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use("/api/v1/auth/", routes_1.default.auth);
app.use("/", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(doc));
app.use(error_handlers_1.errorHandler);
app.all("*", error_handlers_1.notFoundError);
(0, server_entry_1.default)(app);
