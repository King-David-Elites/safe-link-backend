import express from "express";
import cors from "cors";
import helmet from "helmet";
import serverEntry from "./entry/server.entry";
import { errorHandler, notFoundError } from "./handlers/error.handlers";
import routes from "./routes";
import swagger from "swagger-ui-express";
import handleMediaUpload from "./controllers/media.controller";
import { multerUploader } from "./helpers/upload";
import { runJobs } from "./jobs";
import { verifyEmailHTML } from "./templates/verifyEmail";
import sendMail from "./helpers/mailer";
const doc = require("../doc.json");

const app = express();

const TEN_MINUTES = 1000 * 60 * 10;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(cors());
app.use(helmet());

app.get("/", (req, res, next) => {
  res.redirect("/api/v1/doc");
});

app.post("/api/v1/media", multerUploader.single("media"), handleMediaUpload);
app.use("/api/v1/auth/", routes.auth);
app.use("/api/v1/user/", routes.user);
app.use("/api/v1/influencer/", routes.influencer);
app.use("/api/v1/inventory/", routes.inventory);
app.use("/api/v1/questions/", routes.questions);
app.use("/api/v1/subscription/", routes.subscription);
app.use("/api/v1/referral/", routes.referral);
app.use("/api/v1/ping/", routes.ping);
app.use("/api/v1/doc", swagger.serve, swagger.setup(doc));

app.all("*", notFoundError);
app.use(errorHandler);

// sendMail({
//   to: "kolawoleiwalewa@gmail.com",
//   subject: "SAFELINK ACCOUNT VERIFICATION",
//   html: verifyEmailHTML({ username: "kolawole" }, "tokenasd"),
// }),
//Running Cron Jobs on Server
runJobs();
//Staring the Server
serverEntry(app);
