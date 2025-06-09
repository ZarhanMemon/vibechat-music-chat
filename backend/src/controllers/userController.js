import User from "../modules/userModel.js";
import FriendRequest from "../modules/FriendRequest.js";
import Message from "../modules/messageModel.js";

/**
 * Recommend users who are not the current user and not already friends.
 */
export async function getRecommendUsers(req, res) {
  try {
    const currentClerkId = req.auth.userId;

    const me = await User.findOne({ clerkId: currentClerkId }).select("_id friends");
    if (!me) return res.status(404).json({ message: "User not found" });

    const excludeIds = [me._id, ...me.friends];

    const recommendations = await User.find({
      _id: { $nin: excludeIds },
    }).select("fullname imageUrl clerkId");

    return res.status(200).json(recommendations);
  } catch (error) {
    console.error("Error in getRecommendUsers:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get current user's populated friends list.
 */
export async function getFriends(req, res) {
  try {
    const currentClerkId = req.auth?.userId;
    console.log('Getting friends for user:', currentClerkId);
    
    if (!currentClerkId) {
      console.log('No auth found');
      return res.status(401).json({ message: "No authentication found" });
    }

    const user = await User.findOne({ clerkId: currentClerkId })
      .select("friends")
      .populate("friends", "clerkId fullname imageUrl");

    console.log('Found user:', user?._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log('User friends:', user.friends?.length);
    const friends = user.friends?.map(f => ({
      _id: f._id, // Add _id for the component key prop
      clerkId: f.clerkId,
      fullname: f.fullname,
      imageUrl: f.imageUrl,
    })) || [];

    return res.status(200).json(friends);
  } catch (error) {
    console.error("Error in getFriends:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Send a friend request.
 */
export async function sendFriendRequest(req, res) {
  try {
    const senderClerkId = req.auth.userId;
    const recipientClerkId = req.params.id;

    if (senderClerkId === recipientClerkId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const sender = await User.findOne({ clerkId: senderClerkId }).select("_id");
    const recipient = await User.findOne({ clerkId: recipientClerkId }).select("_id friends");

    if (!sender || !recipient) {
      return res.status(404).json({ message: "Sender or recipient not found" });
    }

    if (recipient.friends.includes(sender._id)) {
      return res.status(400).json({ message: "Already friends" });
    }

    // 🔒 Check for *any* existing request between users (in either direction, any status)
    const existing = await FriendRequest.findOne({
      $or: [
        { sender: sender._id, recipient: recipient._id },
        { sender: recipient._id, recipient: sender._id },
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already exists between users" });
    }

    const friendRequest = await FriendRequest.create({
      sender: sender._id,
      recipient: recipient._id,
      status: "pending",
    });

    return res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


/**
 * Accept a friend request.
 */
export async function acceptFriendRequest(req, res) {
  try {
    const currentClerkId = req.auth.userId;
    const requestId = req.params.id;

    const user = await User.findOne({ clerkId: currentClerkId }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (!friendRequest.recipient.equals(user._id)) {
      return res.status(403).json({ message: "Not authorized to accept this request" });
    }    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user to the other's friends list
    const [senderUpdate, recipientUpdate] = await Promise.all([
      User.updateOne(
        { _id: friendRequest.sender },
        { $addToSet: { friends: friendRequest.recipient } }
      ),
      User.updateOne(
        { _id: friendRequest.recipient },
        { $addToSet: { friends: friendRequest.sender } }
      )
    ]);

    console.log('Friend request accepted:', {
      sender: friendRequest.sender,
      recipient: friendRequest.recipient,
      senderUpdated: senderUpdate.modifiedCount,
      recipientUpdated: recipientUpdate.modifiedCount
    });

    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error in acceptFriendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Reject a friend request.
 */
export async function rejectFriendRequest(req, res) {
  try {
    const currentClerkId = req.auth.userId;
    const requestId = req.params.id;

    const user = await User.findOne({ clerkId: currentClerkId }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    if (!friendRequest.recipient.equals(user._id)) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }

    friendRequest.status = "rejected";
    await friendRequest.save();

    return res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error in rejectFriendRequest:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get incoming pending and outgoing accepted/rejected requests.
 */

export async function getFriendRequests(req, res) {
  try {
    const currentClerkId = req.auth.userId;

    const user = await User.findOne({ clerkId: currentClerkId }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Incoming: requests sent to current user (pending)
    const incoming = await FriendRequest.find({
      recipient: user._id,
      status: "pending",
    }).populate("sender", "fullname imageUrl clerkId");

    // Outgoing: requests accepted, sent by current user
    const outgoing = await FriendRequest.find({
      sender: user._id,
      status: "accepted",
    }).populate("recipient", "fullname imageUrl clerkId");

    // Rejected: requests rejected, sent by current user
    const rejectedRaw = await FriendRequest.find({
      sender: user._id,
      status: "rejected",
    }).populate("recipient", "fullname imageUrl clerkId");

    // Normalize rejected requests to match frontend expectation (use recipient as "sender")
    const rejected = rejectedRaw.map((req) => ({
      ...req.toObject(),
      sender: req.recipient, // mimic sender field so frontend can access .sender.fullname and .sender.imageUrl
    }));


    return res.status(200).json({
      incoming,
      outgoing,
      rejected,
    });
  } catch (error) {
    console.error("Error in getFriendRequests:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * Get pending outgoing requests.
 */
export async function getOutgoingFriendReqs(req, res) {
  try {
    const currentClerkId = req.auth.userId;
    const user = await User.findOne({ clerkId: currentClerkId }).select("_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    const outgoing = await FriendRequest.find({
      sender: user._id,
      status: "pending",
    }).populate("recipient", "fullname imageUrl clerkId");

    return res.status(200).json(outgoing);
  } catch (error) {
    console.error("Error in getOutgoingFriendReqs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


/**
 * Get messages between the current user and another user.
 */
export async function getMessages(req, res) {
  try {
    const currentClerkId = req.auth.userId;
    const otherUserId = req.params.userId;

    if (!currentClerkId || !otherUserId) {
      return res.status(400).json({ message: "Invalid request parameters" });
    }

    const currentUser = await User.findOne({ clerkId: currentClerkId }).select("_id");
    const otherUser = await User.findOne({ clerkId: otherUserId }).select("_id");

    if (!currentUser || !otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch messages between the two users
    const messages = await Message.find({
      $or: [
        { sender: currentUser._id, recipient: otherUser._id },
        { sender: otherUser._id, recipient: currentUser._id },
      ]
    }).sort({ sentAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

