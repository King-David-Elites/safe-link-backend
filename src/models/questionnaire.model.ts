import mongoose from "mongoose";
import Collections from "../interfaces/collections";
import { IQuestionnaire } from "../interfaces/models/questionnaire.interface";

const QuestionnaireSchema = new mongoose.Schema<IQuestionnaire>(
  {
    question: { type: String, required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Questionnaire = mongoose.model(
  Collections.questionnaire,
  QuestionnaireSchema
);

export default Questionnaire;
