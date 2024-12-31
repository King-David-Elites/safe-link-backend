import Referral from "../models/referral.model";
import { generateReferralCode } from "../utils/generateReferralCode";

export async function generateUniqueReferralCode(): Promise<string> {
  let isUnique = false;
  let referralCode = "";

  while (!isUnique) {
    referralCode = generateReferralCode("ref-", 12); // Create a helper function to generate random code
    const existingReferral = await Referral.findOne({ referralCode });
    if (!existingReferral) {
      isUnique = true;
    }
  }

  return referralCode;
}
