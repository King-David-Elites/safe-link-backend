import { Subscription } from 'paystack-sdk/dist/subscription/subscription';
import UserSubscriptionModel from '../models/user.subscription.model';
import { endOfToday } from 'date-fns';
import { PlansEnum } from '../interfaces/models/subscription.interface';
import cron from 'node-cron';
import settings from '../constants/settings';
import axios from 'axios'

export async function runJobs() {
  cron.schedule('0 0 * * *', handleSubscriptionJob);
  cron.schedule('1 * * * *', pingServer); //Make the Server Active every 14 minutes
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

async function pingServer() {
  try {
    // Replace with the actual URL where your server is running
    const serverUrl =  'https://cream-card-api.onrender.com';
    await axios.get(serverUrl);
    console.log('Server pinged successfully');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error pinging the server:', error.message);
    } else {
      console.error('Error pinging the server:', error);
    }
  }
}
