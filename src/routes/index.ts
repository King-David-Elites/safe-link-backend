import auth from "./auth.routes";
import questions from "./questions.routes";
import user from "./user.routes";
import influencer from "./influencer.routes";
import inventory from "./inventory.routes";
import otp from "./otp.routes";
import subscription from "./subscription.routes";
import referral from "./referral.routes";
import ping from "./ping";

const routes = {
  auth,
  questions,
  user,
  inventory,
  otp,
  subscription,
  ping,
  influencer,
  referral,
};

export default routes;
