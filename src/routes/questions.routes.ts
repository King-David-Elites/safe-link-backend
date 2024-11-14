import { Router } from "express";
import validate from "../validations";
import {
  AddQuestionInput,
  AnswerQuestionInput,
  EditQuestionInput,
} from "../validations/questions.validation";
import questionControllers from "../controllers/questions.controller";
import isAuth from "../middleware/isAuth";

const router = Router();

router
  .route("/")
  .post(validate(AddQuestionInput), questionControllers.addQuestion)
  .get(questionControllers.getAllQuestions);
router
  .route("/:id")
  .put(validate(EditQuestionInput), questionControllers.editQuestion)
  .delete(questionControllers.deleteQuestion);

router
  .route("/:id/answer")
  .post(
    isAuth,
    validate(AnswerQuestionInput),
    questionControllers.answerQuestion
  );

router.route("/answer").get(isAuth, questionControllers.getUserAnswers);
router.route("/answer/user/:id").get(questionControllers.getUserByIdAnswers);

export default router;
