import mongoose from "mongoose";



const messageSchema = new mongoose.Schema({
  sender: {
    type: String, // or ObjectId if linking to a User
    required: true
  },
  recipient: {
    type: String, // or ObjectId if linking to a User
    required: true
  },
  content: {
    type: String,
    required: true
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

const Message = mongoose.model("Message" , messageSchema)
export default Message;