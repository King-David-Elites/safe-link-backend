import mongoose from "mongoose";
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
    const formData = new FormData();
    formData.append("inventory_id", newInventory._id.toString());

    await axios.post(
      "https://safelink.up.railway.app/add_inventory_to_ai",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
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
  return await Inventory.find<IInventory>({ owner: userId })
    .sort({
      createdAt: -1,
    })
    .lean();
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

// New function to get users with non-free plans and no listed products
const freePlan = "65dc534815ce9430aa0ab114";
const getUsersWithNonFreePlansAndNoListings = async () => {
  try {
    // Find users with plans that are not freePlan
    const usersWithNonFreePlans = await UserSubscriptionModel.aggregate([
      {
        $match: {
          plan: { $ne: new mongoose.Types.ObjectId(freePlan) }, // Exclude freePlan
        },
      },
      {
        $group: {
          _id: "$user", // Group by user ID
        },
      },
    ]);
    console.log({ usersWithNonFreePlans });

    // Extract user IDs
    const userIds = usersWithNonFreePlans.map((user) => user._id);

    // Find users who have no listings in the Inventory
    const usersWithNoListings = await Inventory.aggregate([
      {
        $match: {
          owner: { $in: userIds }, // Match users with non-free plans
        },
      },
      {
        $group: {
          _id: "$owner", // Group by owner ID
          count: { $sum: 1 }, // Count the number of listings
        },
      },
      {
        $match: {
          count: { $eq: 0 }, // Filter to only those with zero listings
        },
      },
    ]);

    // Extract user IDs with no listings
    const userIdsWithNoListings = usersWithNoListings.map((user) => user._id);

    return userIdsWithNoListings; // Return the list of user IDs
  } catch (error) {
    console.error(
      "Error fetching users with non-free plans and no listings:",
      error
    );
    throw new Error("Could not fetch users");
  }
};

const inventoryService = {
  getUserInventories,
  editInventory,
  deleteInventory,
  createInventory,
  getSingleInventory,
  getUsersWithNonFreePlansAndNoListings,
};

export default inventoryService;
