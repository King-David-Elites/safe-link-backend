import mongoose from 'mongoose';
import {
  ISubscriptionPlan,
  PlansEnum,
} from '../interfaces/models/subscription.interface';
import Collections from '../interfaces/collections';

const PlanSchema = new mongoose.Schema<ISubscriptionPlan>({
  name: {
    type: String,
    enum: Object.values(PlansEnum),
  },
  price: {
    type: Number,
  },
  listingsCap: {
    type: Number,
  },
  duration: {
    type: Number,
  },
  planCode: {
    type: String,
  },
});

const PlanModel = mongoose.model(Collections.subscriptionPlan, PlanSchema);
export default PlanModel;
