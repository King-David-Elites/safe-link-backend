import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../constants/errors";
import { IInventory } from "../interfaces/models/inventory.interface";
import { ISubscriptionPlan } from "../interfaces/models/subscription.interface";
import Inventory from "../models/inventory.model";
import UserSubscriptionModel from "../models/user.subscription.model";
import {
  conditionalArrayUpload,
  uploaderListOfMedia,
  uploadVideos,
} from "../utils/uploader";
import axios from "axios";

const createInventory = async (
  body: Omit<IInventory, "_id">
): Promise<IInventory> => {
  let { title, description, price, currency, owner, images, videos } = body;

  const plan = await UserSubscriptionModel.findOne({
    user: owner,
  })
    .populate("plan")
    .then((subscription) => subscription?.plan as ISubscriptionPlan);

  let cap = plan?.listingsCap || 10;

  const usersListings = await Inventory.find({ owner });

  // Uncomment if the cap logic is needed
  // if (usersListings.length >= cap) {
  //   throw new BadRequestError(
  //     `Oops! the plan you're subscribed to only allows ${cap} listings`
  //   );
  // }

  if (images) {
    images = await uploaderListOfMedia(images);
  }

  if (videos) {
    videos = await uploadVideos(videos);
  }

  const newInventory = await Inventory.create({
    title,
    description,
    price,
    currency,
    owner,
    images,
    videos,
  });

  // Notify the external AI training service
  try {
    await axios.post("https://safelink.up.railway.app/add_inventory_to_ai", {
      inventory_id: newInventory._id, // Send the created inventory ID
    });
    console.log("Inventory ID sent to AI training service");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Failed to notify AI training service:", error.message);
    } else {
      console.error("Failed to notify AI training service:", error);
    }
  }

  return newInventory;
};

const getUserInventories = async (userId: string): Promise<IInventory[]> => {
  return await Inventory.find<IInventory>({ owner: userId }).sort({
    createdAt: -1,
  });
};

const deleteInventory = async (userId: string, inventoryId: string) => {
  const inventory = await Inventory.findById(inventoryId);

  if (!inventory) throw new NotFoundError("Inventory does not exist");

  if (inventory.owner.toString() != userId.toString())
    throw new ForbiddenError("Inventory does not belong to you");

  await inventory.deleteOne();
};

const editInventory = async (
  userId: string,
  body: Partial<IInventory>
): Promise<IInventory> => {
  let { title, description, price, currency, owner, images, videos } = body;

  const inventory = await Inventory.findById(body._id);

  if (!inventory) throw new NotFoundError("Inventory does not exist");

  if (inventory.owner.toString() != userId.toString())
    throw new ForbiddenError("Inventory does not belong to you");

  // if (images) {
  //   images = await conditionalArrayUpload(
  //     images,
  //     inventory.images,
  //     uploaderListOfMedia
  //   );
  // }

  // if (videos) {
  //   videos = await uploadVideos(videos);
  // }

  inventory.title = title || inventory.title;
  inventory.description = description || inventory.description;
  inventory.price = price || inventory.price;
  inventory.currency = currency || inventory.currency;
  inventory.images = images || inventory.images;
  inventory.videos = videos || inventory.videos;

  return await inventory.save();
};

const getSingleInventory = async (inventoryId: string): Promise<IInventory> => {
  const inventory = await Inventory.findById(inventoryId).populate({
    path: "owner",
    select: "email name profilePicture phoneNumber _id",
  });

  if (!inventory) throw new NotFoundError("Inventory does not exist");

  return inventory;
};

const inventoryService = {
  getUserInventories,
  editInventory,
  deleteInventory,
  createInventory,
  getSingleInventory,
};

export default inventoryService;
