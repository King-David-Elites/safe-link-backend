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
    price: number().required(),
    currency: string().required(),
    title: string().required(),
    description: string().required(),
  }),
});
