import mongoose, { FilterQuery } from "mongoose";
import { BadRequestError, NotFoundError } from "../constants/errors";
import { IUser } from "../interfaces/models/user.interface";
import { IChangePasswordReq } from "../interfaces/responses/auth.response";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import argon2 from "argon2";
import {
  conditionalArrayUpload,
  conditionalSingleUpload,
  uploader,
  uploaderListOfMedia,
} from "../utils/uploader";

const getById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  return user;
};

const getByEmail = async (email: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  return user;
};

const changePassword = async (body: IChangePasswordReq) => {
  const { userId, confirmNewPassword, newPassword, oldPassword } = body;

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError(
      "New password and confirm new password do not match"
    );
  }

  const user = await userService.getById(userId);

  const userAuth = await Auth.findOne({ email: user.email });

  if (!userAuth) {
    throw new NotFoundError("User does not exist");
  }

  const isPasswordMatch = await userAuth?.verifyPassword(oldPassword);

  if (!isPasswordMatch) {
    throw new BadRequestError("Old password is incorrect");
  }

  const newPasswordHash = await argon2.hash(newPassword);

  userAuth.password = newPasswordHash;

  await userAuth.save();
};

const editUser = async (body: Partial<IUser>): Promise<IUser> => {
  let {
    firstName,
    lastName,
    username,
    about,
    profilePicture,
    coverPicture,
    professionalPictures,
    workPictures,
    leisurePictures,
    address,
    city,
    zipCode,
    state,
    country,
    phoneNumber,
    _id,
  } = body;

  const user = await User.findById(_id);

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  user.profilePicture = await conditionalSingleUpload(
    profilePicture,
    user.profilePicture,
    uploader
  );

  user.coverPicture = await conditionalSingleUpload(
    coverPicture,
    user.coverPicture,
    uploader
  );

  user.workPictures = await conditionalArrayUpload(
    workPictures,
    user.workPictures,
    uploaderListOfMedia
  );

  user.professionalPictures = await conditionalArrayUpload(
    professionalPictures,
    user.professionalPictures,
    uploaderListOfMedia
  );

  user.leisurePictures = await conditionalArrayUpload(
    leisurePictures,
    user.leisurePictures,
    uploaderListOfMedia
  );

  const fieldsToUpdate = {
    firstName,
    lastName,
    username,
    about,
    address,
    city,
    zipCode,
    state,
    country,
    phoneNumber,
  };

  for (const [key, value] of Object.entries(fieldsToUpdate)) {
    if (value !== undefined) {
      (user as any)[key] = value; // Explicit cast to 'any' to bypass the error
    }
  }

  const requiredFields = [
    user.firstName,
    user.lastName,
    user.username,
    user.about,
    user.profilePicture,
    user.coverPicture,
    user.professionalPictures,
    user.workPictures,
    user.leisurePictures,
    user.address,
    // user.city,
    // user.zipCode,
    user.state,
    user.country,
    user.phoneNumber,
  ];

  const isProfileComplete = requiredFields.every((field) => {
    // const value = user[field as keyof IUser];
    if (Array.isArray(field)) {
      // console.log(field, field.length > 0);
      return field.length > 0;
    }

    return Boolean(field);
  });

  // Check if the subscription status is not 'FREE'
  const isSubscriptionValid = user.subscriptionStatus !== "free";

  // Set the profile completion status considering both conditions
  user.isProfileCompleted = isProfileComplete; //&& isSubscriptionValid;
  // console.log({ isProfileComplete, user });

  return await user.save();
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete<IUser>(userId);

  if (!user) throw new NotFoundError("User does not exist");

  await Auth.findOneAndDelete({ email: user?.email });
};

const getUsers = async (search?: string) => {
  const query: FilterQuery<IUser> = {};

  if (search) {
    query.username = { $regex: search, $options: "i" };
  }

  const users = await User.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: "usersubscriptions",
        localField: "user",
        foreignField: "_id",
        as: "subscription",
        pipeline: [
          {
            $lookup: {
              from: "subscriptionplans",
              localField: "plan",
              foreignField: "_id",
              as: "plan",
            },
          },
          {
            $unwind: {
              path: "$plan",
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$subscription",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        "subscription.plan.price": -1,
        createdAt: 1,
      },
    },
  ]);

  return users;
};

// New function to get users with complete profiles
export const getCompleteProfiles = async () => {
  try {
    // Query to find users with all required fields completed
    const users = await User.find({
      $and: [
        { firstName: { $ne: null, $exists: true, $nin: [""] } },
        { lastName: { $ne: null, $exists: true, $nin: [""] } },
        { email: { $ne: null, $exists: true, $nin: [""] } },
        { username: { $ne: null, $exists: true, $nin: [""] } },
        { about: { $ne: null, $exists: true, $nin: [""] } },
        { profilePicture: { $ne: null, $exists: true, $nin: [""] } },
        { coverPicture: { $ne: null, $exists: true, $nin: [""] } },
        { professionalPictures: { $ne: null, $exists: true, $nin: [""] } },
        { workPictures: { $ne: null, $exists: true, $nin: [""] } },
        { leisurePictures: { $ne: null, $exists: true, $nin: [""] } },
        { address: { $ne: null, $exists: true, $nin: [""] } },
        { city: { $ne: null, $exists: true, $nin: [""] } },
        { state: { $ne: null, $exists: true, $nin: [""] } },
        { country: { $ne: null, $exists: true, $nin: [""] } },
        { phoneNumber: { $ne: null, $exists: true, $nin: [""] } },
      ],
    });

    // Return the list of users with complete profiles
    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        "Error fetching users with complete profiles: " + error.message
      );
    } else {
      throw new Error("Error fetching users with complete profiles");
    }
  }
};

// New function to get the top 12 users with complete profiles
const ids: string[] = [
  "67373b6c4482733902e9fe79",
  // "673cb9c0fe3fb1cb3f4c4d6c",
  // "6740bc36ce598243e5c35ae7",
  // "673f9b66a137a04f9c663d37",
  // "673f9b66a137a04f9c663d37",
  // "6741258dce598243e5c35f43",
  // "66d4cc5d67cf6df5d674517c",
  // "6742081be84480635ad795c5",
];

export const getTopCompleteProfiles = async () => {
  try {
    // Fetch a random selection of 12 users
    const users = await User.aggregate([
      { $match: { isProfileCompleted: true } },
      { $sample: { size: 12 } },
    ]);

    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        "Error fetching random users with complete profiles: " + error.message
      );
    } else {
      throw new Error("Error fetching random users with complete profiles");
    }
  }
};

const getByUsername = async (formattedUsername: string) => {
  // Ensure username is case-insensitive if required
  // return await User.findOne({ username: new RegExp(`^${formattedUsername}$`, "i") });
  return await User.findOne({ formattedUsername: formattedUsername });
};

const generateShareableLink = async (userId: string): Promise<string> => {
  // Fetch the user by their ID
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  // If the shareable link already exists, return it
  if (user.shareableLink) {
    return user.shareableLink;
  }

  // // Check if the user profile is complete
  // if (!user.isProfileCompleted) {
  //   throw new BadRequestError(
  //     "User profile is incomplete. Please complete your profile to generate a shareable link."
  //   );
  // }

  // // Ensure the user's subscription is not FREE
  // if (user.subscriptionStatus === "free") {
  //   throw new BadRequestError(
  //     "Shareable link is only available for paid subscription users. Please upgrade your subscription."
  //   );
  // }

  // Generate the shareable link based on the username
  const formattedUsername = user.username.replace(/\s+/g, "-").toLowerCase();
  const shareableLink = `https://www.joinsafelink.com/${formattedUsername}`;

  // Save the generated link to the user's record
  user.shareableLink = shareableLink;
  user.formattedUsername = formattedUsername;
  await user.save();

  return shareableLink;
};

const updateProfilePicture = async (userId: string, profilePicture: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  const uploadedPicture = await uploader(profilePicture); // Use the uploader utility to handle the file

  user.profilePicture = uploadedPicture;
  await user.save();

  return user;
};

export const getUnsubscribedCompleteProfiles = async () => {
  const freePlan = "65dc534815ce9430aa0ab114";
  try {
    const users = await User.aggregate([
      { $match: { isProfileCompleted: true } },
      {
        $lookup: {
          from: "usersubscriptions",
          localField: "_id",
          foreignField: "user",
          as: "subscription",
        },
      },
      {
        $unwind: {
          path: "$subscription",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "subscription.plan": new mongoose.Types.ObjectId(freePlan), // Match users with free subscription
        },
      },
    ]);

    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        "Error fetching random users with complete profiles and no subscription: " +
          error.message
      );
    } else {
      throw new Error(
        "Error fetching random users with complete profiles and no subscription"
      );
    }
  }
};

const userService = {
  getById,
  getByEmail,
  changePassword,
  editUser,
  deleteUser,
  getUsers,
  getCompleteProfiles,
  getTopCompleteProfiles,
  getUnsubscribedCompleteProfiles,
  getByUsername,
  generateShareableLink,
  updateProfilePicture,
};

export default userService;
