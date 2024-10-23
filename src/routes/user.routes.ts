import { Router } from 'express';
import isAuth from '../middleware/isAuth';
import userController from '../controllers/user.controller';
import validate from '../validations';
import { EditUserInput } from '../validations/user.validation';
import subscriptionController from '../controllers/subscription.controller';

const router = Router();

router
  .route('/')
  .get(isAuth, userController.getMyInfo)
  .put(isAuth, validate(EditUserInput), userController.editUser)
  .delete(isAuth, userController.deleteUser);

router.route('/all').get(userController.getUsers);
router.route('/:email').get(userController.getUserByEmail);
router
  .route('/subscription/plan')
  .get(subscriptionController.getSubscriptionPlans);

router.post(
  '/subscription/subscribe',
  isAuth,
  subscriptionController.subscribe
);
router.post(
  'subscription/cancel',
  isAuth,
  subscriptionController.cancelSubscriptionController
);
router.post(
  'subscription/webhook',
  isAuth,
  subscriptionController.webhookHandler
);

export default router;
