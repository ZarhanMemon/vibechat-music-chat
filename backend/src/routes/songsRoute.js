import express from 'express';
import {getAllSongs,getFeaturedSongs,getTrendingSongs,getMadeForYouSongs } from "../controllers/songsController.js"
import { protectAuth , checkAdmin } from '../middlewares/protectAuth.js';

 

const router = express.Router();

 

router.get("/", protectAuth,checkAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-for-you", getMadeForYouSongs);
router.get("/trending", getTrendingSongs);

export default router;