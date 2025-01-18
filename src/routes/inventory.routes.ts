import { Router } from "express";
import isAuth from "../middleware/isAuth";
import {
  CreateInventoryInput,
  EditInventoryInput,
} from "../validations/inventory.validation";
import validate from "../validations";
import inventoryControllers from "../controllers/inventory.controller";
import { multerUploader } from "../helpers/upload";

const router = Router();

router
  .route("/")
  .post(
    isAuth,
    multerUploader.array("media"),
    validate(CreateInventoryInput),
    inventoryControllers.addToInventory
  );

router.route("/user").get(isAuth, inventoryControllers.getMyInventories);

router
  .route("/subscribed/no-inventory")
  .get(inventoryControllers.getUsersWithNonFreePlansAndNoListings);

router.route("/user/:id").get(inventoryControllers.getUserInventories);

router
  .route("/:id")
  .put(
    isAuth,
    validate(EditInventoryInput),
    multerUploader.array("media"),
    inventoryControllers.editInventory
  )
  .delete(isAuth, inventoryControllers.deleteInventory)
  .get(inventoryControllers.getSingleInventory);

export default router;
