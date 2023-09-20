"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const collections_1 = __importDefault(require("../interfaces/collections"));
const QuestionnaireSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });
const Questionnaire = mongoose_1.default.model(collections_1.default.questionnaire, QuestionnaireSchema);
exports.default = Questionnaire;
