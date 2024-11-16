import { NextFunction, Request, Response } from "express";
import { IChangePasswordReq } from "../interfaces/responses/auth.response";
import userService from "../services/user.service";
import { IRequest } from "../interfaces/expressRequest";

const changePassword = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const { newPassword, oldPassword, confirmNewPassword } = req.body;

  const userId = <string>req.userId;

  try {
    await userService.changePassword({
      userId,
      newPassword,
      oldPassword,
      confirmNewPassword,
    });

    res
      .status(200)
      .json({ message: "Password Changed Successfully", data: null });
  } catch (error) {
    return next(error);
  }
};

const editUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const _id = <string>req.userId;

    const data = await userService.editUser({ ...req.body, _id });

    return res
      .status(200)
      .json({ message: "Profile updated successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getMyInfo = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = <string>req.userId;

    const data = await userService.getById(userId);

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUserByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = <string>req.params.email;

    const data = await userService.getByEmail(email);

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = <string>req.params.id;

    const data = await userService.getById(id);

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const userId = <string>req.userId;

    await userService.deleteUser(userId);

    res.status(200).json({ message: "User profile deleted successfully" });
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (
  req: Request<{}, {}, {}, { search?: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await userService.getUsers(req.query.search);

    res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
};

export const getCompleteProfiles = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Fetch the list of users with filled name, phone number, and email from the service
    const users = await userService.getCompleteProfiles();

    // Check if users are found and send appropriate response
    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found with complete profiles' });
    }

    // Send the list of users as a response
    return res.status(200).json({ users });
  } catch (error) {
    // Handle any errors and send a 500 status code if necessary
    const errorMessage = (error instanceof Error) ? error.message : 'Unknown error';
    return res.status(500).json({ message: 'Failed to retrieve users', error: errorMessage });
  }
};


const getUserByUsername = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const username = <string>req.params.username; // Extract username from URL params

    const data = await userService.getByUsername(username); // Call the service to fetch user by username

    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User Info fetched successfully", data });
  } catch (error) {
    return next(error); // Pass errors to the error handler
  }
};

const generateUserShareableLink = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = <string>req.userId;

    const shareableLink = await userService.generateShareableLink(userId);

    res.status(200).json({
      message: "Shareable link generated successfully",
      data: { shareableLink },
    });
  } catch (error) {
    next(error);
  }
};


const userController = {
  changePassword,
  editUser,
  deleteUser,
  getMyInfo,
  getUserByEmail,
  getUserById,
  getUsers,
  getCompleteProfiles,
  getUserByUsername,
  generateUserShareableLink,
};

export default userController;