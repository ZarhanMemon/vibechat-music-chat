import { Server } from 'socket.io';
import Message from '../modules/messageModel.js'; // Import the Message model





export const initializeSocketIO = (SocketServer) => {
    const io = new Server(SocketServer, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
        },
    });

    // Store connected users and their activities
    const connectedUsers = new Map();  // userId: socketId
    const userActivity = new Map();    // userId: activity status
    const unreadMessages = new Map();  // userId: Set of senderIds with unread messages

    io.on('connection', (socket) => {
        console.log('New socket connection:', socket.id);

        socket.on('user_connected', (userId) => {
            if (!userId) return;
            
            console.log(`User ${userId} connected with socket ID: ${socket.id}`);
            connectedUsers.set(userId, socket.id);
            userActivity.set(userId, "Idle");

            // Broadcast to everyone that this user connected
            io.emit('user_connected', userId);

            // Send current state to the newly connected user
            socket.emit('initialize_state', {
                onlineUsers: Array.from(connectedUsers.keys()),
                activities: Array.from(userActivity)
            });


        })        
        
        
        socket.on('update_activity', (data) => {
            const { userId, activity } = data;
            // Update the user's activity in the userActivity map
            userActivity.set(userId, activity);

            // Emit the updated activity to all connected users
            io.emit('activity_updated', { userId, activity });

            console.log(`User ${userId} activity updated to: ${activity}`);
        });


        socket.on('send_message', async (data) => {

            try {

                const {sender, recipient, content, sentAt, read} = data;

                const message = await Message.create({
                    sender,
                    recipient,
                    content,
                    sentAt,
                    read
                });

                // Get recipient's socket ID
                const receiverSocketId = connectedUsers.get(recipient);

                // Track unread message
                if (!unreadMessages.has(recipient)) {
                    unreadMessages.set(recipient, new Set());
                }
                unreadMessages.get(recipient).add(sender);

                // Emit to recipient
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("receive_message", message);
                    io.to(receiverSocketId).emit("unread_messages_update", {
                        unreadFrom: Array.from(unreadMessages.get(recipient))
                    });
                }

                socket.emit("message_sent", message);

            } catch (error) {
                console.error("Message error:", error);
				socket.emit("message_error", error.message);
            }

        })

        // Add a handler for marking messages as read
        socket.on('mark_messages_read', ({from, to}) => {
            if (unreadMessages.has(to)) {
                unreadMessages.get(to).delete(from);
                
                // Notify the recipient about the updated unread messages
                const recipientSocket = connectedUsers.get(to);
                if (recipientSocket) {
                    io.to(recipientSocket).emit("unread_messages_update", {
                        unreadFrom: Array.from(unreadMessages.get(to))
                    });
                }
            }
        });


        // Friend request handling
        socket.on('send_friend_request', async ({ from, to }) => {
            const receiverSocketId = connectedUsers.get(to);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('friend_request_received', { from });
            }
        });

        socket.on('accept_friend_request', async ({ requestId, from, to }) => {
            const senderSocketId = connectedUsers.get(from);
            if (senderSocketId) {
                io.to(senderSocketId).emit('friend_request_accepted', requestId);
            }
        });


        socket.on('disconnect', () => {

            let disconnectedUserId; // Initialize variable to hold the disconnected userId

            // Find the userId associated with the disconnected socket
            for (const [userId, socketId] of connectedUsers.entries()) {

                if (socketId === socket.id) {

                    disconnectedUserId = userId; // Store the disconnected userId

                    connectedUsers.delete(userId); // Remove user from connected users map
                    userActivity.delete(userId); // Remove user activity on disconnect

                    console.log(`User ${userId} disconnected`);


                    io.emit('connected_users', userId); // Notify all users about disconnection
                    break;
                }
            }

            if (disconnectedUserId) {
                io.emit('user_disconnected', disconnectedUserId);
                console.log(`User ${disconnectedUserId} is now offline`);
            }
        });

    })

}