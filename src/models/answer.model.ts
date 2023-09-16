import mongoose, { Collection, Types } from "mongoose";
import { IAnswerToQuestionnaire } from "../interfaces/models/questionnaire.interface";
import Collections from "../interfaces/collections";

const AnswerSchema = new mongoose.Schema<IAnswerToQuestionnaire>(
  {
    userId: { type: Types.ObjectId, required: true, ref: Collections.user },

    questionId: {
      type: Types.ObjectId,
      required: true,
      ref: Collections.questionnaire,
    },

    answer: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Answer = mongoose.model(Collections.answer, AnswerSchema);

export default Answer;
