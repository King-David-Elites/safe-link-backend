import mongoose, { Types, Model } from "mongoose";
import { IInfluencer } from "../interfaces/models/influencer.interface";


const InfluencerSchema = new mongoose.Schema<IInfluencer>({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    referralCode: {
        type: String,
        unique: true,
        required: true,
    },
},
{ timestamps: true, },
);

const Influencer: Model<IInfluencer> = mongoose.model<IInfluencer>(
    "Influencer",
    InfluencerSchema
  );

export default Influencer;