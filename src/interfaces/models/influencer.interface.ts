import { Types } from "mongoose";


export interface IInfluencer{
    _id: Types.ObjectId,
    name: string,
    referralCode: string,
    createdAt: Date,
    updatedAt: Date,
}