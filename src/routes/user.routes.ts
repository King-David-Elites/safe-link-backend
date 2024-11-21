import { Router } from "express";
import isAuth from "../middleware/isAuth";
import userController from "../controllers/user.controller";
import validate from "../validations";
import { EditUserInput } from "../validations/user.validation";
const router = Router();

router
  .route("/")
  .get(isAuth, userController.getMyInfo)
  .put(isAuth, validate(EditUserInput), userController.editUser)
  .delete(isAuth, userController.deleteUser);

router.route("/all").get(userController.getUsers);
router.route("/complete-profiles").get(userController.getCompleteProfiles);
router
  .route("/static-complete-profiles")
  .get(userController.getStaticCompleteProfiles);
router.route("/top-12-sellers").get(userController.getTopCompleteProfiles);
router
  .route("/shareable-link")
  .get(isAuth, userController.generateUserShareableLink);
router.route("/:id").get(userController.getUserById);
router.route("/:email").get(userController.getUserByEmail);
router.get("/profile/:username", userController.getUserByUsername);

export default router;
