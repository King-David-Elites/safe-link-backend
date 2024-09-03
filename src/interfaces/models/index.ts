import { Types } from 'mongoose';

export type Relations<T = unknown> = string | Types.ObjectId | T;
