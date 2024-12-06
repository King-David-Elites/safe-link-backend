import Influencer from '../models/influencer.model';

interface InfluencerParams {
  name: string;
  referralCode: string;
}

const createInfluencer = async function ({ name, referralCode }: InfluencerParams) {
    try {
  
      // Check if the email already exists
      const existingInfluencer = await Influencer.findOne({ name });
      if (existingInfluencer) {
        throw new Error('An influencer with this email already exists.');
      }
  
      // Create a new influencer
      const newInfluencer = new Influencer({
        name,
        referralCode,
      });
  
      await newInfluencer.save();
      return newInfluencer;
    } catch (error: any) {
      throw new Error(`Error creating influencer: ${error.message}`);
    }
  }
  
  const influencerService = {
    createInfluencer
  }

  export default influencerService;