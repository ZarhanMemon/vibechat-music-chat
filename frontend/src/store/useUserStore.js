import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { io } from "socket.io-client";


const baseURL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

const socket = io(baseURL, {
  autoConnect: false, // only connect if user is authenticated
  withCredentials: true,
});


const useUserStore = create((set,get) => ({
  // STATES
  myFriends: [],
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messages: [],
  selectedUser: null,


  recommendedUsers: [],
  outgoingFriendRequests: [],
  incomingFriendRequests: [], // Pending friend requests that will trigger notifications
  rejectedFriendRequests: [],
  loading: false,
  error: null,

  // ACTIONS
  initializeSocketListeners: () => {
    const socket = get().socket;

    socket.on('friend_request_received', (request) => {
      set((state) => ({
        incomingFriendRequests: [...state.incomingFriendRequests, request]
      }));
    });

    socket.on('friend_request_accepted', (requestId) => {
      set((state) => ({
        incomingFriendRequests: state.incomingFriendRequests.filter(req => req._id !== requestId),
        outgoingFriendRequests: state.outgoingFriendRequests.filter(req => req._id !== requestId)
      }));
    });

    // ... existing socket listeners ...
  },

  fetchMyFriends: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/users/friends');
      set({ myFriends: data });
    } catch (error) {
      console.error('Failed to fetch friends:', error.response?.data || error.message);
      set({
        error: error.response?.data?.message || 'Failed to fetch friends',
        myFriends: []
      });
    } finally {
      set({ loading: false });
    }
  },

  fetchRecommendedUsers: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/users');
      set({ recommendedUsers: data });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  fetchOutgoingFriendRequests: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/users/outgoing-friend-requests');
      set({ outgoingFriendRequests: data });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  fetchFriendRequests: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/users/friend-requests');
      set({
        incomingFriendRequests: data.incoming,
        outgoingFriendRequests: data.outgoing,
        rejectedFriendRequests: data.rejected,
      });
    } catch (error) {
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  sendFriendRequest: async (userId) => {
    try {
      const { data } = await axiosInstance.post(`/users/friend-request/${userId}`);
      return data;
    } catch (error) {
      console.error("Error sending friend request:", error.response?.data || error.message);
      set({ error: error.response?.data?.message || "Failed to send friend request" });
      throw error;
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      const { data } = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
      return data;
    } catch (error) {
      set({ error });
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      const { data } = await axiosInstance.post(`/users/friend-request/${requestId}/reject`);
      return data;
    } catch (error) {
      set({ error });
    }
  },



  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] }); // Clear messages when changing users
  },

  markMessageAsRead: async (messageId) => {
    const socket = get().socket;
    if (!socket || !get().isConnected) return;

    socket.emit('mark_message_read', { messageId });
  },

  initSocket: (userId) => {
    if (!get().isConnected) {
      socket.auth = { userId };
      socket.connect();

      socket.emit("user_connected", userId);

      socket.on("initialize_state", ({ onlineUsers, activities }) => {
        set({
          onlineUsers: new Set(onlineUsers),
          userActivities: new Map(activities)
        });
      });

      socket.on("user_connected", (userId) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          const newActivities = new Map(state.userActivities);
          newActivities.delete(userId);
          return { 
            onlineUsers: newOnlineUsers,
            userActivities: newActivities 
          };
        });
      });

      socket.on("receive_message", (message) => {
        set((state) => {
          // Mark message as received and emit read status if chat is open
          if (state.selectedUser?.clerkId === message.sender) {
            socket.emit('mark_message_read', { messageId: message._id });
            message.read = true;
          }
          return {
            messages: [...state.messages, message],
          };
        });
      });

      socket.on("message_read", ({ messageId }) => {
        set((state) => ({
          messages: state.messages.map(msg =>
            msg._id === messageId ? { ...msg, read: true } : msg
          )
        }));
      });

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false, messages: [] });
    }
  },

  sendMessage: async (messageData) => {
    const socket = get().socket;
    if (!socket || !get().isConnected) {
      throw new Error('Socket connection not available');
    }
    
    return new Promise((resolve, reject) => {
      // Set up one-time listeners for this message
      const onMessageSent = (message) => {
        set((state) => ({ messages: [...state.messages, message] }));
        socket.off('message_sent', onMessageSent);
        socket.off('message_error', onMessageError);
        resolve(message);
      };

      const onMessageError = (error) => {
        socket.off('message_sent', onMessageSent);
        socket.off('message_error', onMessageError);
        reject(new Error(error));
      };

      socket.once('message_sent', onMessageSent);
      socket.once('message_error', onMessageError);

      // Send the message
      socket.emit('send_message', messageData);
    });
  },

  fetchFriendMessages: async (userId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/users/messages/${userId}`);
      set({ messages: data });
    } catch (error) {
      console.error('Failed to fetch messages:', error.response?.data || error.message);
      set({ error: error.response?.data?.message || 'Failed to fetch messages' });
    } finally {
      set({ loading: false });
    }
  },

  // Add socket event listener for activity updates
  initializeSocketListeners: () => {
    const socket = get().socket;

    socket.on('activity_updated', ({ userId, activity }) => {
      set((state) => {
        const updatedActivities = new Map(state.userActivities);
        if (activity) {
          updatedActivities.set(userId, activity);
        } else {
          updatedActivities.delete(userId);
        }
        return { userActivities: updatedActivities };
      });
    });

    socket.on('unread_messages_update', ({ unreadFrom }) => {
      set({ unreadMessages: unreadFrom });
    });

    socket.on('receive_message', (message) => {
      set((state) => ({
        messages: [...state.messages, message],
        unreadMessages: state.selectedUser?.clerkId !== message.sender 
          ? Array.from(new Set([...state.unreadMessages, message.sender]))
          : state.unreadMessages
      }));
    });
  },

  // Add method to mark messages as read
  markMessagesAsRead: () => {
    const { unreadMessages, socket } = get();
    const myUserId = get().user?.id;

    if (socket?.auth && myUserId && unreadMessages?.length) {
      // Mark all unread messages as read
      unreadMessages.forEach(senderId => {
        socket.emit('mark_messages_read', {
          from: senderId,
          to: myUserId
        });
      });

      // Clear unread messages from the store
      set({ unreadMessages: [] });
    }
  },

}));


export default useUserStore;
