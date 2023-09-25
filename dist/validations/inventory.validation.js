"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditInventoryInput = exports.CreateInventoryInput = void 0;
const yup_1 = require("yup");
exports.CreateInventoryInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        price: (0, yup_1.number)().required(),
        currency: (0, yup_1.string)().required(),
        title: (0, yup_1.string)().required(),
        description: (0, yup_1.string)().required(),
    }),
});
exports.EditInventoryInput = (0, yup_1.object)({
    body: (0, yup_1.object)({
        price: (0, yup_1.number)().notRequired(),
        currency: (0, yup_1.string)().notRequired(),
        title: (0, yup_1.string)().notRequired(),
        description: (0, yup_1.string)().notRequired(),
    }),
});
