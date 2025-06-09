import express from 'express';
 import {getAlbum , getAlbumSongs} from "../controllers/albumController.js"
 

const router = express.Router();


router.get('/getAlbum', getAlbum)

router.get('/:albumId', getAlbumSongs)


export default router;