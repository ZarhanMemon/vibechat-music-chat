import express from 'express';
import { getStates} from "../controllers/statesController.js"
import { protectAuth, checkAdmin } from '../middlewares/protectAuth.js';



const router = express.Router();


router.get('/', protectAuth, checkAdmin, getStates)

export default router;