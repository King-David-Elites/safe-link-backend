import { NotFoundError } from "../constants/errors";
import {
  IAnswerToQuestionnaire,
  IQuestionnaire,
} from "../interfaces/models/questionnaire.interface";
import Answer from "../models/answer.model";
import Questionnaire from "../models/questionnaire.model";

const getQuestionById = async (_id: string): Promise<IQuestionnaire> => {
  const question = await Questionnaire.findById(_id);

  if (!question) {
    throw new NotFoundError("Question does not exist");
  }

  return question;
};

const addQuestion = async (
  body: Partial<IQuestionnaire>
): Promise<IQuestionnaire> => {
  const question = body.question;

  return await Questionnaire.create({ question });
};

const getQuestions = async (): Promise<IQuestionnaire[]> => {
  const questions = await Questionnaire.find({});

  return questions;
};

const editQuestion = async (body: IQuestionnaire): Promise<IQuestionnaire> => {
  const { _id, question: newQuestion } = body;

  const question = await Questionnaire.findByIdAndUpdate(_id, {
    question: newQuestion,
  });

  if (!question) {
    throw new NotFoundError("Question does not exist");
  }

  return question;
};

const deleteQuestion = async (_id: string) => {
  const question = await Questionnaire.findByIdAndDelete(_id);

  if (!question) {
    throw new NotFoundError("Question does not exist");
  }
};

const answerQuestion = async (body: Omit<IAnswerToQuestionnaire, "_id">) => {
  const { userId, questionId, answer } = body;

  // safeguard to ensure the question exists
  await getQuestionById(questionId as string);

  const answerInDb = await Answer.findOne({ userId, questionId });

  if (answerInDb) {
    answerInDb.answer = answer;

    await answerInDb.save();
  } else {
    await Answer.create({
      userId,
      questionId,
      answer,
    });
  }
};

const getUserAnswers = async (
  userId: string
): Promise<IAnswerToQuestionnaire[]> => {
  const answers = await Answer.find({ userId }).populate("questionId");

  return answers;
};

const questionService = {
  getUserAnswers,
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
  answerQuestion,
};

export default questionService;
