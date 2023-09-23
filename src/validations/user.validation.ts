import { array, number, object, string } from "yup";

export const EditUserInput = object({
  body: object({
    name: string().notRequired(),
    about: string().notRequired(),
    profilePicture: string().notRequired(),
    professionalPictures: array(string()).notRequired(),
    workPictures: array(string()).notRequired(),
    leisurePictures: array(string()).notRequired(),
    address: string().notRequired(),
    city: string().notRequired(),
    zipCode: string().notRequired(),
    state: string().notRequired(),
    country: string().notRequired(),
    phoneNumber1: number().notRequired(),
    phoneNumber2: number().notRequired(),
  }),
});
