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
const questions_service_1 = __importDefault(require("../services/questions.service"));
const addQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const question = req.body.question;
        const data = yield questions_service_1.default.addQuestion({ question });
        res.status(201).json({ message: "Question Added Successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const getAllQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield questions_service_1.default.getQuestions();
        res.status(200).json({ message: "Questions fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const editQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.id;
        const question = req.body.question;
        const data = yield questions_service_1.default.editQuestion({
            question,
            _id: questionId,
        });
        res.status(200).json({ message: "Question edited successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const deleteQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.id;
        yield questions_service_1.default.deleteQuestion(questionId);
        res
            .status(200)
            .json({ message: "Question deleted successfully", data: null });
    }
    catch (error) {
        return next(error);
    }
});
const answerQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questionId = req.params.id;
        const userId = req.userId;
        const answer = req.body.answer;
        const data = yield questions_service_1.default.answerQuestion({
            questionId,
            userId,
            answer,
        });
        res.status(201).json({ message: "Question Answered Successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const getUserAnswers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const data = yield questions_service_1.default.getUserAnswers(userId);
        res
            .status(200)
            .json({ message: "User's answers fetched successfully", data });
    }
    catch (error) {
        return next(error);
    }
});
const questionControllers = {
    getUserAnswers,
    getAllQuestions,
    addQuestion,
    editQuestion,
    deleteQuestion,
    answerQuestion,
};
exports.default = questionControllers;
