import cloudinary from '../lib/cloudinary.js';
import Song from '../modules/songsModel.js'; // Song model
import Album from "../modules/albumModel.js"; // Album model




// Helper function to upload files to Cloudinary
const uploadToCloudinary = async (file, resourceType = 'auto') => {
    try {
        if (!file) {
            throw new Error('No file provided');
        }

        const filePath = file.tempFilePath || file;
        
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: resourceType,
            folder: resourceType === 'video' ? 'songs' : 'images',
        });
        
        return result.secure_url;
    } catch (error) {
        console.error("Error in uploadToCloudinary:", error);
        throw new Error(`Error uploading to cloudinary: ${error.message}`);
    }
};



// Create a new song with audio and image upload
export const createSong = async (req, res) => {
  try {
    console.log('Creating song with body:', req.body);
    console.log('Files received:', req.files);

    const { title, artist, albumId, duration } = req.body;

    let audiofile = req.files?.audiofile;
    let imagefile = req.files?.imagefile;

    // Normalize file structure: get first if array
    if (Array.isArray(audiofile)) audiofile = audiofile[0];
    if (Array.isArray(imagefile)) imagefile = imagefile[0];

    // Validate inputs
    if (!title || !artist || !duration) {
      return res.status(400).json({ msg: 'Missing required fields: title, artist, or duration' });
    }

    if (!audiofile || !audiofile.tempFilePath) {
      return res.status(400).json({ msg: 'Audio file is missing or invalid' });
    }

    if (!imagefile || !imagefile.tempFilePath) {
      return res.status(400).json({ msg: 'Image file is missing or invalid' });
    }

    console.log('Uploading files to Cloudinary...');    // ✅ Upload using actual temp file paths with correct resource types
    const audioUrl = await uploadToCloudinary(audiofile.tempFilePath, "video"); // Use video type for audio files
    const imageUrl = await uploadToCloudinary(imagefile.tempFilePath, "image");

    const newSong = new Song({
      title,
      artist,
      albumId: albumId || null,
      imgUrl: imageUrl,
      audioUrl,
      duration,
    });

    await newSong.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: newSong._id },
      });
    }

    res.status(201).json({ newSong });
  } catch (error) {
    console.error("Error creating song:", error);
    res.status(500).json({ msg: 'Server error while creating song' });
  }
};






// Delete a song by ID and remove its reference from album if any
export const deleteSong = async (req, res) => {
  try {
    const { songId } = req.params;

    const song = await Song.findById(songId);

    // Remove song reference from album if it exists
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(songId);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to delete song" });
  }
};



// Create a new album with image upload
export const createAlbum = async (req, res) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const imagefile = req.files?.imagefile;

    // Handle if imagefile is an array
    if (Array.isArray(imagefile)) {
      imagefile = imagefile[0];
    }
    // Validate required fields
    if (!title || !artist || !releaseYear || !imagefile) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Upload album image to Cloudinary
    const imgUrl = await uploadToCloudinary(imagefile);    // Create new album document
    const newAlbum = new Album({
      title,
      artist,
      releaseYear,
      imgUrl,
      songs: [] // Initialize empty songs array
    });

    await newAlbum.save();

    // Handle songs if provided
    const songIds = req.body['songs[]'];
    if (songIds) {
      // Update album with songs
      if (Array.isArray(songIds)) {
        newAlbum.songs = songIds;
      } else {
        newAlbum.songs = [songIds]; // Handle single song case
      }
      await newAlbum.save();

      // Update each song with the album reference
      const songsToUpdate = Array.isArray(songIds) ? songIds : [songIds];
      await Song.updateMany(
        { _id: { $in: songsToUpdate } },
        { albumId: newAlbum._id }
      );
    }

    res.status(201).json({ msg: "Album created", album: newAlbum });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error creating album" });
  }
};


// Delete album by ID and delete all associated songs
export const deleteAlbum = async (req, res) => {
  try {
    const { albumId: id } = req.params;

    // Delete all songs associated with the album
    await Song.deleteMany({ albumId: id });

    // Delete the album itself
    await Album.findByIdAndDelete(id);

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error deleting album" });
  }
};


 
