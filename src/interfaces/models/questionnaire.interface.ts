import { Types } from "mongoose";
import { IUser } from "./user.interface";

export interface IQuestionnaire {
  question: string;
  _id: string;
}

export interface IAnswerToQuestionnaire {
  _id: string;
  userId: string | Types.ObjectId | IUser;
  questionId: string | Types.ObjectId | IQuestionnaire;
  answer: string;
}
