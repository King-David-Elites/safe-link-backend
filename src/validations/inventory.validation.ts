import { number, object, string } from "yup";

export const CreateInventoryInput = object({
  body: object({
    price: number().required(),
    currency: string().required(),
    title: string().required(),
    description: string().required(),
  }),
});

export const EditInventoryInput = object({
  body: object({
    price: number().notRequired(),
    currency: string().notRequired(),
    title: string().notRequired(),
    description: string().notRequired(),
  }),
});
