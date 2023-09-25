"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnswerQuestionInput = exports.EditQuestionInput = exports.AddQuestionInput = void 0;
const yup_1 = require("yup");
exports.AddQuestionInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        question: (0, yup_1.string)().required(),
    }),
});
exports.EditQuestionInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        question: (0, yup_1.string)().required(),
    }),
    params: (0, yup_1.object)({
        id: (0, yup_1.string)().required(),
    }),
});
exports.AnswerQuestionInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        answer: (0, yup_1.string)().required(),
    }),
});
