import express from 'express';
import {
  createSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  
} from '../controllers/adminController.js';

import { protectAuth , checkAdmin } from '../middlewares/protectAuth.js';

const router = express.Router();

// Middleware to protect routes: first verify user is authenticated, then check admin rights
router.use(protectAuth,checkAdmin)




// Simple route to check if current user is admin
router.get('/check', (req, res) => {
  res.json({ admin: 'true' });
});

// Create a new song (admin only)
router.post('/create-song', createSong);

// Delete a song by ID (admin only)
router.delete('/delete-song/:songId',  deleteSong);

// Create a new album (admin only)
router.post('/create-album',  createAlbum);

// Delete an album by ID (admin only)
router.delete('/delete-album/:albumId', deleteAlbum);

export default router;
