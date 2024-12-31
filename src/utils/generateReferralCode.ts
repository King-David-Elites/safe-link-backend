export type ReferralType = "ref-" | "inf-";

export const generateReferralCode = (
  type: ReferralType,
  length: number
): string => {
  const prefix = type;
  const remainingLength = length - prefix.length;
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = prefix;

  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};
