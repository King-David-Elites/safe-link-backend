import { Application } from "express";
import mongoose from "mongoose";
import settings from "../constants/settings";
import logger from "../helpers/logger";

const port = 3001;

const serverEntry = (app: Application) => {
  app.listen(port, () => {
    logger.info(`Server is listening on port ${port}`);
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

export default serverEntry;
