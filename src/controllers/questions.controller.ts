import { NextFunction, Request, Response } from "express";
import questionService from "../services/questions.service";
import { IRequest } from "../interfaces/expressRequest";

const addQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const question = req.body.question;

    const data = await questionService.addQuestion({ question });

    res.status(201).json({ message: "Question Added Successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getAllQuestions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await questionService.getQuestions();

    res.status(200).json({ message: "Questions fetched successfully", data });
  } catch (error) {
    return next(error);
  }
};

const editQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionId = req.params.id;
    const question = req.body.question;

    const data = await questionService.editQuestion({
      question,
      _id: questionId,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionId = req.params.id;

    await questionService.deleteQuestion(questionId);

    res
      .status(200)
      .json({ message: "Question deleted successfully", data: null });
  } catch (error) {
    return next(error);
  }
};

const answerQuestion = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const questionId = req.params.id;
    const userId = <string>req.userId;
    const answer = req.body.answer;

    const data = await questionService.answerQuestion({
      questionId,
      userId,
      answer,
    });

    res.status(201).json({ message: "Question Answered Successfully", data });
  } catch (error) {
    return next(error);
  }
};

const getUserAnswers = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = <string>req.userId;

    const data = await questionService.getUserAnswers(userId);

    res.status(200).json({ message: "User's answers fetched successfully" });
  } catch (error) {
    return next(error);
  }
};

const questionControllers = {
  getUserAnswers,
  getAllQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
  answerQuestion,
};

export default questionControllers;
