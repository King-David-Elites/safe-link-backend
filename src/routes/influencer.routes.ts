import { Router } from "express";
import  influencerController from "../controllers/influencer.controller";
const router = Router();

router
    .route("/create-influencer")
    .post(influencerController.createInfluencer);



export default router;