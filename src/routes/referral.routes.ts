import { Router } from "express";
import referralController from "../controllers/referral.controller";
import isAuth from "../middleware/isAuth";

const router = Router();

router
  .route("/current-month/subscribed")
  .get(referralController.getCurrentMonthreferrals);

router.get("/my-referral", isAuth, referralController.getReferral);
router.post("/create-referral", isAuth, referralController.createReferral);
router.patch("/update-referral", isAuth, referralController.updateReferral);

export default router;
