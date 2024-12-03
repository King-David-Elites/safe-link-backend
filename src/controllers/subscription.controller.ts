import { NextFunction, Request, Response } from "express";
import { IRequest } from "../interfaces/expressRequest";
import {
  cancelSubscription,
  getAllSubscribedUsers,
  getPlans,
  getUserSubscriptionStatus,
  handleWebhooks,
  // manuallyUpdateCustomerSubscription,
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

// const manualSubscription = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const id = req.body.id;
//     const reference = req.body.reference;
//     console.log({ id, reference });
//     if (!id || !reference) {
//       return res
//         .status(400)
//         .json({ message: "please provide the id and reference" });
//     }
//     const payment = await manuallyUpdateCustomerSubscription(id, reference);

//     res.status(200).json({ message: "processed" });
//   } catch (error) {
//     return next(error);
//   }
// };

const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const activeSubscriptions = await getAllSubscribedUsers();
    res.status(200).json({
      success: true,
      subscriptions: activeSubscriptions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Controller to check a user's subscription status
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {void}
 */
const checkUserSubscriptionStatus = async (req: IRequest, res: Response) => {
  try {
    const subscriptionStatus = await getUserSubscriptionStatus(req.userId!);
    res.status(200).json({
      success: true,
      subscriptionStatus,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const subscriptionController = {
  getSubscriptionPlans,
  cancelSubscriptionController,
  subscribe,
  webhookHandler,
  // manualSubscription,
  getAllSubscriptions,
  checkUserSubscriptionStatus,
};

export default subscriptionController;
