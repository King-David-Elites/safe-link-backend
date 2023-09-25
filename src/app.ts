import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";
import serverEntry from "./entry/server.entry";
import { errorHandler, notFoundError } from "./handlers/error.handlers";
import routes from "./routes";
import swagger from "swagger-ui-express";
import handleMediaUpload from "./controllers/media.controller";
import { multerUploader } from "./helpers/upload";
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

app.get("/", (req, res, next) => {
  res.redirect("/api/v1/doc");
});

app.post("/api/v1/media", multerUploader.single("media"), handleMediaUpload);
app.use("/api/v1/auth/", routes.auth);
app.use("/api/v1/user/", routes.user);
app.use("/api/v1/inventory/", routes.inventory);
app.use("/api/v1/questions/", routes.questions);
app.use("/api/v1/doc", swagger.serve, swagger.setup(doc));

app.use(errorHandler);
app.all("*", notFoundError);

serverEntry(app);
