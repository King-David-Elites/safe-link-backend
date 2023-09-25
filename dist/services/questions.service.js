"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../constants/errors");
const answer_model_1 = __importDefault(require("../models/answer.model"));
const questionnaire_model_1 = __importDefault(require("../models/questionnaire.model"));
const getQuestionById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield questionnaire_model_1.default.findById(_id);
    if (!question) {
        throw new errors_1.NotFoundError("Question does not exist");
    }
    return question;
});
const addQuestion = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const question = body.question;
    return yield questionnaire_model_1.default.create({ question });
});
const getQuestions = () => __awaiter(void 0, void 0, void 0, function* () {
    const questions = yield questionnaire_model_1.default.find({});
    return questions;
});
const editQuestion = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, question: newQuestion } = body;
    const question = yield questionnaire_model_1.default.findByIdAndUpdate(_id, {
        question: newQuestion,
    });
    if (!question) {
        throw new errors_1.NotFoundError("Question does not exist");
    }
    return question;
});
const deleteQuestion = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const question = yield questionnaire_model_1.default.findByIdAndDelete(_id);
    if (!question) {
        throw new errors_1.NotFoundError("Question does not exist");
    }
});
const answerQuestion = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, questionId, answer } = body;
    // safeguard to ensure the question exists
    yield getQuestionById(questionId);
    const answerInDb = yield answer_model_1.default.findOne({ userId, questionId });
    if (answerInDb) {
        answerInDb.answer = answer;
        yield answerInDb.save();
    }
    else {
        yield answer_model_1.default.create({
            userId,
            questionId,
            answer,
        });
    }
});
const getUserAnswers = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield answer_model_1.default.find({ userId }).populate("questionId");
    return answers;
});
const questionService = {
    getUserAnswers,
    getQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    answerQuestion,
};
exports.default = questionService;
