import { Application } from "express";
import mongoose, { Types } from "mongoose";
import settings from "../constants/settings";
import logger from "../helpers/logger";
import seedDb from "../seeders";
import { runJobs } from "../jobs";

const port = 3001;
console.log("mongo db url", process.env.MONGODB_URL);

const serverEntry = (app: Application) => {
  mongoose
    .connect(settings.mongoDbUrl)
    .then(async () => {
      app.listen(port, () => {
        logger.info(`Server is listening on port ${port}`);
      });
      // await seedDb();
      // await runJobs();
    })
    .catch((error) => {
      logger.error(error);
    });
};

export default serverEntry;
