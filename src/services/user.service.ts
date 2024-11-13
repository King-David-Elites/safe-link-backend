import { FilterQuery } from 'mongoose';
import { BadRequestError, NotFoundError } from '../constants/errors';
import { IUser } from '../interfaces/models/user.interface';
import { IChangePasswordReq } from '../interfaces/responses/auth.response';
import Auth from '../models/user.auth.model';
import User from '../models/user.model';
import argon2 from 'argon2';
import { uploader, uploaderListOfMedia } from '../utils/uploader';

const getById = async (id: string): Promise<IUser> => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  return user;
};

const getByEmail = async (email: string): Promise<IUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  return user;
};

const changePassword = async (body: IChangePasswordReq) => {
  const { userId, confirmNewPassword, newPassword, oldPassword } = body;

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError(
      'New password and confirm new password do not match'
    );
  }

  const user = await userService.getById(userId);

  const userAuth = await Auth.findOne({ email: user.email });

  if (!userAuth) {
    throw new NotFoundError('User does not exist');
  }

  const isPasswordMatch = await userAuth?.verifyPassword(oldPassword);

  if (!isPasswordMatch) {
    throw new BadRequestError('Old password is incorrect');
  }

  const newPasswordHash = await argon2.hash(newPassword);

  userAuth.password = newPasswordHash;

  await userAuth.save();
};

const editUser = async (body: Partial<IUser>): Promise<IUser> => {
  let {
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
    phoneNumber,
    _id,
  } = body;

  const user = await User.findById(_id);

  if (!user) {
    throw new NotFoundError('User does not exist');
  }

  if(profilePicture){
    profilePicture = await uploader(profilePicture)
  }

  if(workPictures){
    workPictures = await uploaderListOfMedia(workPictures)
  }

  if(professionalPictures){
    professionalPictures = await uploaderListOfMedia(professionalPictures)
  }

  if(leisurePictures){
    leisurePictures = await uploaderListOfMedia(leisurePictures)
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
  user.phoneNumber = phoneNumber || user.phoneNumber;

  return await user.save();
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete<IUser>(userId);

  if (!user) throw new NotFoundError('User does not exist');

  await Auth.findOneAndDelete({ email: user?.email });
};

const getUsers = async (search?: string) => {
  const query: FilterQuery<IUser> = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  const users = await User.aggregate([
    {
      $match: query,
    },
    {
      $lookup: {
        from: 'usersubscriptions',
        localField: 'user',
        foreignField: '_id',
        as: 'subscription',
        pipeline: [
          {
            $lookup: {
              from: 'subscriptionplans',
              localField: 'plan',
              foreignField: '_id',
              as: 'plan',
            },
          },
          {
            $unwind: {
              path: '$plan',
              preserveNullAndEmptyArrays: true,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$subscription',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: {
        'subscription.plan.price': -1,
        createdAt: 1,
      },
    },
  ]);

  return users;
};

const userService = {
  getById,
  getByEmail,
  changePassword,
  editUser,
  deleteUser,
  getUsers,
};

export default userService;