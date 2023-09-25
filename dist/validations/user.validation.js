"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditUserInput = void 0;
const yup_1 = require("yup");
exports.EditUserInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        name: (0, yup_1.string)().notRequired(),
        about: (0, yup_1.string)().notRequired(),
        profilePicture: (0, yup_1.string)().notRequired(),
        professionalPictures: (0, yup_1.array)((0, yup_1.string)()).notRequired(),
        workPictures: (0, yup_1.array)((0, yup_1.string)()).notRequired(),
        leisurePictures: (0, yup_1.array)((0, yup_1.string)()).notRequired(),
        address: (0, yup_1.string)().notRequired(),
        city: (0, yup_1.string)().notRequired(),
        zipCode: (0, yup_1.string)().notRequired(),
        state: (0, yup_1.string)().notRequired(),
        country: (0, yup_1.string)().notRequired(),
        phoneNumber1: (0, yup_1.number)().notRequired(),
        phoneNumber2: (0, yup_1.number)().notRequired(),
    }),
});
