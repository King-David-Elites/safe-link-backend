import { object, string } from "yup";

export const AddQuestionInput = object({
  body: object({
    question: string().required(),
  }),
});

export const EditQuestionInput = object({
  body: object({
    question: string().required(),
  }),
  params: object({
    id: string().required(),
  }),
});

export const AnswerQuestionInput = object({
  body: object({
    answer: string().required(),
  }),
});
