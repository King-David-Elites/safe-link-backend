import { Router } from "express";
import isAuth from "../middleware/isAuth";
import {
  CreateInventoryInput,
  EditInventoryInput,
} from "../validations/inventory.validation";
import validate from "../validations";
import inventoryControllers from "../controllers/inventory.controller";

const router = Router();

router
  .route("/")
  .post(
    isAuth,
    validate(CreateInventoryInput),
    inventoryControllers.addToInventory
  )
  .get(isAuth, inventoryControllers.getMyInventories);

router
  .route("/:id")
  .put(isAuth, validate(EditInventoryInput), inventoryControllers.editInventory)
  .delete(isAuth, inventoryControllers.deleteInventory)
  .get(inventoryControllers.getSingleInventory);

router.route("/user/:id").get(inventoryControllers.getUserInventories);

export default router;
