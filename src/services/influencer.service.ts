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

  const getAllInfluencers = async function () {
    try {
      const influencers = await Influencer.find();
      return influencers;
    } catch (error: any) {
      throw new Error(`Error fetching all influencers: ${error.message}`);
    }
  };
  
  const getInfluencerById = async function (id: string) {
    try {
      const influencer = await Influencer.findById(id);
      if (!influencer) {
        throw new Error('Influencer not found.');
      }
      return influencer;
    } catch (error: any) {
      throw new Error(`Error fetching influencer by ID: ${error.message}`);
    }
  };

  const updateInfluencer = async function (id: string, updates: Partial<InfluencerParams>) {
    try {
      const influencer = await Influencer.findByIdAndUpdate(id, updates, { new: true });
      if (!influencer) {
        throw new Error('Influencer not found.');
      }
      return influencer;
    } catch (error: any) {
      throw new Error(`Error updating influencer: ${error.message}`);
    }
  };
  
  const deleteInfluencer = async function (id: string) {
    try {
      const influencer = await Influencer.findByIdAndDelete(id);
      if (!influencer) {
        throw new Error('Influencer not found.');
      }
      return influencer;
    } catch (error: any) {
      throw new Error(`Error deleting influencer: ${error.message}`);
    }
  };
  
  const influencerService = {
    createInfluencer,
    getAllInfluencers,
    getInfluencerById,
    updateInfluencer,
    deleteInfluencer,
  }

  export default influencerService;