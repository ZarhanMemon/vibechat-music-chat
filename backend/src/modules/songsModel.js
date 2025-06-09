import mongoose from "mongoose";

const songsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String,
    required: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,  // ❌ Don't use `Mongoose` here, just use lowercase `mongoose`
    ref: "Album",                          // ✅ This should match your Album model name
    required: false
  },
  duration: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Songs = mongoose.model("Songs", songsSchema);
export default Songs;
