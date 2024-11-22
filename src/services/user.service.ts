import { FilterQuery } from "mongoose";
import { BadRequestError, NotFoundError } from "../constants/errors";
import { IUser } from "../interfaces/models/user.interface";
import { IChangePasswordReq } from "../interfaces/responses/auth.response";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import argon2 from "argon2";
import { uploader, uploaderListOfMedia } from "../utils/uploader";

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

  if (profilePicture) {
    profilePicture = await uploader(profilePicture);
  }

  if (workPictures) {
    workPictures = await uploaderListOfMedia(workPictures);
  }

  if (professionalPictures) {
    professionalPictures = await uploaderListOfMedia(professionalPictures);
  }

  if (leisurePictures) {
    leisurePictures = await uploaderListOfMedia(leisurePictures);
  }

  user.firstName = firstName || user.firstName;
  user.lastName = lastName || user.lastName;
  user.username = username || user.username;
  user.about = about || user.about;
  user.profilePicture = profilePicture || user.profilePicture;
  user.coverPicture = coverPicture || user.coverPicture;
  user.professionalPictures = professionalPictures || user.professionalPictures;
  user.workPictures = workPictures || user.workPictures;
  user.leisurePictures = leisurePictures || user.leisurePictures;
  user.address = address || user.address;
  user.city = city || user.city;
  user.zipCode = zipCode || user.zipCode;
  user.state = state || user.state;
  user.country = country || user.country;
  user.phoneNumber = phoneNumber || user.phoneNumber;

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
    user.city,
    user.zipCode,
    user.state,
    user.country,
    user.phoneNumber,
  ];
  const isProfileComplete = requiredFields.every(
    (field) => field !== null && field !== "" && field !== undefined
  );

  // Check if the subscription status is not 'FREE'
  const isSubscriptionValid = user.subscriptionStatus !== "free";

  // Set the profile completion status considering both conditions
  user.isProfileCompleted = isProfileComplete && isSubscriptionValid;

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

// Function to fetch static complete profiles
export const getStaticCompleteProfiles = async (): Promise<IUser[]> => {
  try {
    // Static user list (replace with your specific criteria if needed)
    const staticEmails = [
      "oshinoiki@gmail.com",
      "oluwakemipeace@gmail.com",
      "oshinoikid01@gmail.com",
    ];

    // Query users by their emails
    const users = await User.find({ email: { $in: staticEmails } });

    return users;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        "Error fetching static complete profiles: " + error.message
      );
    } else {
      throw new Error("Error fetching static complete profiles");
    }
  }
};

// Function to fetch users with 10 complete profiles, excluding duplicates from static profiles
export const getTopCompleteProfiles = async (): Promise<IUser[]> => {
  try {
    // Fetch the static complete profiles
    const staticProfiles = await getStaticCompleteProfiles();

    // Extract emails of static profiles
    const staticEmails = staticProfiles.map((profile) => profile.email);

    // Fetch the top 12 complete profiles
    const topCompleteProfiles = await User.find({
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
    })
      .sort({ createdAt: -1 }) // Sort by creation date
      .limit(12); // Limit to 12 profiles

    // Exclude the top 12 profiles from the static profiles
    const filteredStaticProfiles = staticProfiles.filter(
      (profile) => !topCompleteProfiles.some((topProfile) => topProfile.email === profile.email)
    );

    return filteredStaticProfiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching profiles to complete: " + error.message);
    } else {
      throw new Error("Error fetching profiles to complete");
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

const userService = {
  getById,
  getByEmail,
  changePassword,
  editUser,
  deleteUser,
  getUsers,
  getCompleteProfiles,
  getStaticCompleteProfiles,
  getTopCompleteProfiles,
  getByUsername,
  generateShareableLink,
  updateProfilePicture,
};

export default userService;
