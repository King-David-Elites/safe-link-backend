import mongoose from 'mongoose';
import PlanModel from '../models/plans.model';
import { PlansEnum } from '../interfaces/models/subscription.interface';

export default async function seedDb() {
  await seedPlans();
}

async function seedPlans() {
  const plans = await PlanModel.find({});

  if (plans.length == 0) {
    await PlanModel.create([
      {
        _id: new mongoose.Schema.Types.ObjectId('650d72f4f1d2a2a4c9b8e4b1'),
        name: PlansEnum.FREE,
        listingsCap: 2,
        price: 0,
      },
      {
        _id: new mongoose.Schema.Types.ObjectId('650d72f4f1d2a2a4c9b8e4b2'),
        name: PlansEnum.BASIC,
        listingsCap: 10,
        price: 10000,
        duration: 1,
        planCode: 'PLN_oykq6xo14c18dgy',
      },
      {
        _id: new mongoose.Schema.Types.ObjectId('650d72f4f1d2a2a4c9b8e4b3'),
        name: PlansEnum.PLUS,
        listingsCap: 20,
        price: 50000,
        duration: 6,
        planCode: 'PLN_sv7h0mego6mcrx9',
      },
      {
        _id: new mongoose.Schema.Types.ObjectId('650d72f4f1d2a2a4c9b8e4b4'),
        name: PlansEnum.PREMIUM,
        listingsCap: 35,
        price: 100000,
        duration: 12,
        planCode: 'PLN_uq13mz3jb9aen8p',
      },
    ]);
  }
}
