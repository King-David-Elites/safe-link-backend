import { Router } from "express";
import referralController from "../controllers/referral.controller";

const router = Router();

router
  .route("/current-month/subscribed")
  .get(referralController.getCurrentMonthreferrals);

export default router;
