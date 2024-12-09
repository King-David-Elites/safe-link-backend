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
router.post("/webhook", subscriptionController.webhookHandler);
// router.post("/manual-subscription", subscriptionController.manualSubscription);

// Route to get all subscribed users
router.get("/subscriptions", subscriptionController.getAllSubscriptions);

// Route to check a user's subscription status by userId
router.get(
  "/subscription-status",
  isAuth,
  subscriptionController.checkUserSubscriptionStatus
);

export default router;
