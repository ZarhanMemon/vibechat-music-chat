import express from 'express';
import { protectAuth } from '../middlewares/protectAuth.js';
import {
  getRecommendUsers,    
  getFriends,             
  sendFriendRequest,
  acceptFriendRequest,
  getFriendRequests,
  getOutgoingFriendReqs,
  rejectFriendRequest,

  getMessages

} from '../controllers/userController.js';




const router = express.Router();

// Protect every route in here
router.use(protectAuth);


// “Meet New Learners”
router.get('/', getRecommendUsers);

// “Your Friends”
router.get('/friends', getFriends);

// Incoming & outgoing friend‐requests
router.get('/friend-requests', getFriendRequests);
router.get('/outgoing-friend-requests', getOutgoingFriendReqs);

// Send / Accept friend requests
router.post('/friend-request/:id', sendFriendRequest);
router.put('/friend-request/:id/accept', acceptFriendRequest);
router.post("/friend-request/:id/reject",rejectFriendRequest)


router.get('/messages/:userId' , getMessages)


export default router;