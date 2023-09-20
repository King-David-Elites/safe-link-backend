import mongoose, { Types } from "mongoose";
import { ICompany } from "../interfaces/models/company.interface";
import Collections from "../interfaces/collections";

const CompanySchema = new mongoose.Schema<ICompany>({
  name: { type: String, required: true },
  websiteUrl: { type: String },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
  address1: { type: String, required: true },
  address2: { type: String },
  country: { type: String },
  city: { type: String },
  zipCode: { type: String },
  email: { type: String, required: true },
  alternativeEmail: { type: String },
  phoneNumber1: { type: Number, required: true },
  phoneNumber2: { type: Number },
  coverPicture: { type: String, required: true },
  ownedBy: { type: Types.ObjectId, ref: Collections.user, required: true },
});

const Company = mongoose.model(Collections.company, CompanySchema);

export default Company;
