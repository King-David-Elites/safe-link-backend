import { NextFunction, Request, Response } from "express";
import { IRequest } from "../interfaces/expressRequest";
import {
  cancelSubscription,
  getPlans,
  handleWebhooks,
  subscribeForPlan,
  verifyWebhook,
} from "../services/subscription.service";
import { BadRequestError } from "../constants/errors";

const subscribe = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { planId } = req.body;

    const auth_url = await subscribeForPlan(req.userId!, planId);

    res.status(200).json({ auth_url });
  } catch (error) {
    return next(error);
  }
};

const cancelSubscriptionController = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await cancelSubscription(req.userId!);

    res.status(200).json({ message: "cancelled" });
  } catch (error) {
    return next(error);
  }
};

const getSubscriptionPlans = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getPlans();

    res.status(200).json(data);
  } catch (error) {
    return next(error);
  }
};

const webhookHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const valid = verifyWebhook(
      req.headers["x-paystack-signature"] as string,
      req.body
    );

    if (!valid) throw new BadRequestError("webhook is not from paystack");

    await handleWebhooks(req.body);

    res.status(200).json({ message: "processed" });
  } catch (error) {
    return next(error);
  }
};

const subscriptionController = {
  getSubscriptionPlans,
  cancelSubscriptionController,
  subscribe,
  webhookHandler,
};

export default subscriptionController;
