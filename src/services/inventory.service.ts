import { ForbiddenError, NotFoundError } from "../constants/errors";
import { IInventory } from "../interfaces/models/inventory.interface";
import Inventory from "../models/inventory.model";

const createInventory = async (
  body: Omit<IInventory, "_id">
): Promise<IInventory> => {
  const { title, description, price, currency, owner, images, videos } = body;

  return await Inventory.create({
    title,
    description,
    price,
    currency,
    owner,
    images,
    videos,
  });
};

const getUserInventories = async (userId: string): Promise<IInventory[]> => {
  return await Inventory.find<IInventory>({ owner: userId });
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
  const { title, description, price, currency, owner, images, videos } = body;

  const inventory = await Inventory.findById(body._id);

  if (!inventory) throw new NotFoundError("Inventory does not exist");

  if (inventory.owner.toString() != userId.toString())
    throw new ForbiddenError("Inventory does not belong to you");

  inventory.title = title || inventory.title;
  inventory.description = description || inventory.description;
  inventory.price = price || inventory.price;
  inventory.images = images || inventory.images;
  inventory.videos = videos || inventory.videos;

  return await inventory.save();
};

const getSingleInventory = async (inventoryId: string): Promise<IInventory> => {
  const inventory = await Inventory.findById(inventoryId);

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
