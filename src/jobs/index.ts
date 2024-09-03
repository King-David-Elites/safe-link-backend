import { Subscription } from 'paystack-sdk/dist/subscription/subscription';
import UserSubscriptionModel from '../models/user.subscription.model';
import { endOfToday } from 'date-fns';
import { PlansEnum } from '../interfaces/models/subscription.interface';
import cron from 'node-cron';

export async function runJobs() {
  cron.schedule('0 0 * * *', handleSubscriptionJob);
}

async function handleSubscriptionJob() {
  try {
    const subscriptions = await UserSubscriptionModel.find({
      expiryDate: { $gt: endOfToday() },
      name: { $ne: PlansEnum.FREE },
      isActive: true,
    });

    for (const subscription of subscriptions) {
      subscription.isActive = false;
      // sendReminderMail
      await subscription.save();
    }
  } catch (error) {
    console.error(error);
  }
}
