import { Router } from 'express';
import isAuth from '../middleware/isAuth';
import userController from '../controllers/user.controller';
import validate from '../validations';
import { EditUserInput } from '../validations/user.validation';

const router = Router();

router
  .route('/')
  .get(isAuth, userController.getMyInfo)
  .put(isAuth, validate(EditUserInput), userController.editUser)
  .delete(isAuth, userController.deleteUser);

router.route('/all').get(userController.getUsers);
router.route('/:email').get(userController.getUserByEmail);

export default router;
