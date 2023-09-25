"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = __importDefault(require("../constants/settings"));
const logger_1 = __importDefault(require("../helpers/logger"));
const port = 3001;
const serverEntry = (app) => {
    mongoose_1.default
        .connect(settings_1.default.mongoDbUrl)
        .then(() => {
        app.listen(port, () => {
            logger_1.default.info(`Server is listening on port ${port}`);
        });
    })
        .catch((error) => {
        logger_1.default.error(error);
    });
};
exports.default = serverEntry;
