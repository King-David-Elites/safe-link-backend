import { Router } from "express";
import isAuth from "../middleware/isAuth";
import subscriptionController from "../controllers/subscription.controller";

const router = Router();

router.post("/subscribe", isAuth, subscriptionController.subscribe);
router.post(
  "/cancel",
  isAuth,
  subscriptionController.cancelSubscriptionController
);
router.get("/plan", subscriptionController.getSubscriptionPlans);
router.post("/webhook", isAuth, subscriptionController.webhookHandler);

export default router;
