import { BadRequestError, NotFoundError } from "../constants/errors";
import { IUser } from "../interfaces/models/user.interface";
import { IChangePasswordReq } from "../interfaces/responses/auth.response";
import Auth from "../models/user.auth.model";
import User from "../models/user.model";
import argon2 from "argon2";

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
  const {
    name,
    about,
    profilePicture,
    professionalPictures,
    workPictures,
    leisurePictures,
    address,
    city,
    zipCode,
    state,
    country,
    phoneNumber1,
    phoneNumber2,
    _id,
  } = body;

  const user = await User.findById(_id);

  if (!user) {
    throw new NotFoundError("User does not exist");
  }

  user.name = name || user.name;
  user.about = about || user.about;
  user.profilePicture = profilePicture || user.profilePicture;
  user.professionalPictures = professionalPictures || user.professionalPictures;
  user.workPictures = workPictures || user.workPictures;
  user.leisurePictures = leisurePictures || user.leisurePictures;
  user.address = address || user.address;
  user.city = city || user.city;
  user.zipCode = zipCode || user.zipCode;
  user.state = state || user.state;
  user.country = country || user.country;
  user.phoneNumber1 = phoneNumber1 || user.phoneNumber1;
  user.phoneNumber2 = phoneNumber2 || user.phoneNumber2;

  return await user.save();
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete<IUser>(userId);

  if (!user) throw new NotFoundError("User does not exist");

  await Auth.findOneAndDelete({ email: user?.email });
};

const userService = {
  getById,
  getByEmail,
  changePassword,
  editUser,
  deleteUser,
};

export default userService;
