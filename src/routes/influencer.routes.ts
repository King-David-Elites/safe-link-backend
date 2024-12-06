import { Router } from "express";
import  influencerController from "../controllers/influencer.controller";
const router = Router();

router
    .route("/create-influencer")
    .post(influencerController.createInfluencer);

router
    .route("/all")
    .get(influencerController.getAllInfluencers);

router
    .route("/:id")
    .get(influencerController.getInfluencerById)
    .put(influencerController.updateInfluencer)
    .delete(influencerController.deleteInfluencer);



export default router;