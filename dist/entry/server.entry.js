"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../helpers/logger"));
const port = 3001;
const serverEntry = (app) => {
    app.listen(port, () => {
        logger_1.default.info(`Server is listening on port ${port}`);
    });
    // mongoose
    //   .connect(settings.mongoDbUrl)
    //   .then(() => {
    //     app.listen(port, () => {
    //       logger.info(`Server is listening on port ${port}`);
    //     });
    //   })
    //   .catch((error) => {
    //     logger.error(error);
    //   });
};
exports.default = serverEntry;
