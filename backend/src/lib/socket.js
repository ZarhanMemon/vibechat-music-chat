import { Server } from 'socket.io';
import Message from '../modules/messageModel.js'; // Import the Message model

export const initializeSocketIO = (SocketServer) => {
  const io = new Server(SocketServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  const connectedUsers = new Map();     // userId: socketId
  const userActivity = new Map();       // userId: activity status
  const unreadMessages = new Map();     // userId: Set of senderIds

  io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('user_connected', (userId) => {
      if (!userId) return;

      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
      connectedUsers.set(userId, socket.id);
      userActivity.set(userId, "Idle");

      // Send initial data
      socket.emit('initialize_state', {
        onlineUsers: Array.from(connectedUsers.keys()),
        activities: Array.from(userActivity),
      });

      // Broadcast to others
      io.emit('user_connected', userId);
    });

    socket.on('update_activity', ({ userId, activity }) => {
      userActivity.set(userId, activity);
      io.emit('activity_updated', { userId, activity });
      console.log(`User ${userId} activity updated to: ${activity}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { sender, recipient, content, sentAt, read } = data;

        const message = await Message.create({
          sender,
          recipient,
          content,
          sentAt,
          read,
        });

        // Track unread
        if (!unreadMessages.has(recipient)) {
          unreadMessages.set(recipient, new Set());
        }
        unreadMessages.get(recipient).add(sender);

        const receiverSocketId = connectedUsers.get(recipient);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', message);
          io.to(receiverSocketId).emit('unread_messages_update', {
            unreadFrom: Array.from(unreadMessages.get(recipient)),
          });
        }

        socket.emit('message_sent', message);
      } catch (error) {
        console.error('Message error:', error);
        socket.emit('message_error', error.message);
      }
    });

    socket.on('mark_messages_read', async ({ from, to }) => {
      try {
        // Remove sender from recipient's unread list
        if (unreadMessages.has(to)) {
          unreadMessages.get(to).delete(from);
        }

        // Update in database
        await Message.updateMany(
          { sender: from, recipient: to, read: false },
          { $set: { read: true } }
        );

        const recipientSocket = connectedUsers.get(to);
        if (recipientSocket) {
          io.to(recipientSocket).emit('unread_messages_update', {
            unreadFrom: Array.from(unreadMessages.get(to)),
          });
        }
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('send_friend_request', ({ from, to }) => {
      const receiverSocketId = connectedUsers.get(to);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('friend_request_received', { from });
      }
    });

    socket.on('accept_friend_request', ({ requestId, from, to }) => {
      const senderSocketId = connectedUsers.get(from);
      if (senderSocketId) {
        io.to(senderSocketId).emit('friend_request_accepted', requestId);
      }
    });

    socket.on('disconnect', () => {
      let disconnectedUserId = null;

      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          connectedUsers.delete(userId);
          userActivity.delete(userId);
          unreadMessages.delete(userId); // Optional: clear memory
          console.log(`User ${userId} disconnected`);
          break;
        }
      }

      if (disconnectedUserId) {
        io.emit('user_disconnected', disconnectedUserId);
        console.log(`User ${disconnectedUserId} is now offline`);
      }
    });
  });
};
