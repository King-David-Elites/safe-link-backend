import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import serverEntry from "./entry/server.entry";
import { errorHandler, notFoundError } from "./handlers/error.handlers";
import routes from "./routes";
import swagger from "swagger-ui-express";
const doc = require("./constants/doc.json");

const app = express();

app.use(cors());
app.use(helmet());

const TEN_MINUTES = 1000 * 60 * 10;
app.use(
  rateLimiter({
    windowMs: TEN_MINUTES,
    max: 100,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/", swagger.serve, swagger.setup(doc));
app.use("/api/v1/auth/", routes.auth);

app.use(errorHandler);
app.all("*", notFoundError);

serverEntry(app);
