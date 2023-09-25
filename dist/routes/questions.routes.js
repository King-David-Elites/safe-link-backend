"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validations_1 = __importDefault(require("../validations"));
const questions_validation_1 = require("../validations/questions.validation");
const questions_controller_1 = __importDefault(require("../controllers/questions.controller"));
const isAuth_1 = __importDefault(require("../middleware/isAuth"));
const router = (0, express_1.Router)();
router
    .route("/")
    .post((0, validations_1.default)(questions_validation_1.AddQuestionInput), questions_controller_1.default.addQuestion)
    .get(questions_controller_1.default.getAllQuestions);
router
    .route("/:id")
    .put((0, validations_1.default)(questions_validation_1.EditQuestionInput), questions_controller_1.default.editQuestion)
    .delete(questions_controller_1.default.deleteQuestion);
router
    .route("/:id/answer")
    .post(isAuth_1.default, (0, validations_1.default)(questions_validation_1.AnswerQuestionInput), questions_controller_1.default.answerQuestion);
router.route("/answer").get(isAuth_1.default, questions_controller_1.default.getUserAnswers);
exports.default = router;
