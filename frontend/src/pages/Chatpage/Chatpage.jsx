import Topbar from "../../components/TopBar.jsx";
import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import FriendsList from "./components/FriendsList";
import ChatHeader from "./components/ChatHeader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import useUserStore from "../../store/useUserStore";
import { Check, CheckCheck } from 'lucide-react';

const formatTime = (date) => {
  if (!date) return '';
  const messageDate = new Date(date);
  const now = new Date();

  

  // If message is from today, show time only
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  // If message is from this year, show date without year
  if (messageDate.getFullYear() === now.getFullYear()) {
    return messageDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Otherwise show full date
  return messageDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const MessageStatus = ({ message, isOnline, user }) => {
  if (message.sender !== user?.id) return null;

  return (
    <span className="flex items-center gap-1">
      {message.read ? (
        <CheckCheck className="size-3 text-green-500" />
      ) : (
        <Check className={`size-3 ${isOnline ? "text-green-500" : "text-zinc-400"}`} />
      )}
    </span>
  );
};

const ChatPage = () => {
  const { user } = useUser();
  const { messages, selectedUser, fetchMyFriends, fetchFriendMessages, onlineUsers } = useUserStore();
  // Load friends when user is available
  useEffect(() => {
    const loadFriends = async () => {
      if (user?.id) {
        try {
          await fetchMyFriends();
        } catch (error) {
          console.error('Failed to load friends:', error);
        }
      }
    };
    
    loadFriends();
  }, [user?.id, fetchMyFriends]);

  // Load messages when a friend is selected
  useEffect(() => {
    if (selectedUser?.clerkId && user?.id) {
      fetchFriendMessages(selectedUser.clerkId);
    }
  }, [selectedUser?.clerkId, user?.id, fetchFriendMessages]);


  return (    
  <main className='h-full rounded-lg bg-black/50 overflow-hidden relative'>
      <Topbar />

      <div className='grid lg:grid-cols-[320px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)] relative bg-zinc-900/50'>
        <FriendsList />

        {/* chat message */}
        <div className='flex flex-col h-[97%]'>
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}              
              <ScrollArea className='h-[calc(100vh-340px)]'>
                <div className='p-4 space-y-6'>
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 group transition-opacity hover:opacity-100 ${
                        message.sender === user?.id ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className='size-8 ring-2 ring-offset-2 ring-offset-black ring-zinc-800/50'>
                        <AvatarImage
                          src={
                            message.sender === user?.id
                              ? user.imageUrl
                              : selectedUser.imageUrl
                          }
                          alt={message.sender === user?.id ? user.fullName : selectedUser.fullname}
                        />
                        <AvatarFallback className="bg-zinc-900 text-emerald-500">
                          {message.sender === user?.id
                            ? (user.fullName || '?')[0]
                            : (selectedUser.fullname || '?')[0]
                          }
                        </AvatarFallback>
                      </Avatar>
                      <div className={`flex flex-col gap-1 max-w-[70%] ${
                        message.sender === user?.id ? "items-end" : "items-start"
                      }`}>
                        <div                          className={`rounded-2xl px-4 py-2.5 w-fit shadow-lg transition-all duration-200 
                            ${message.sender === user?.id 
                              ? "bg-emerald-500 rounded-tr-sm" 
                              : "bg-zinc-800 rounded-tl-sm border border-zinc-700/50"
                            }`}
                        >
                          <p className='text-sm break-words whitespace-pre-wrap leading-relaxed'>{message.content}</p>
                        </div>
                        <div className={`flex items-center gap-2 px-2 opacity-60 group-hover:opacity-100 transition-opacity ${
                          message.sender === user?.id ? "flex-row" : "flex-row-reverse"
                        }`}>
                          <span className='text-xs text-zinc-400'>
                            {formatTime(message.sentAt)}
                          </span>
                          <MessageStatus
                            message={message}
                            isOnline={onlineUsers?.has(selectedUser.clerkId)}
                            user={user}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};
export default ChatPage;

const NoConversationPlaceholder = () => (  <div className='flex flex-col items-center justify-center h-full space-y-6 px-4'>
    <div className="relative">
      <div className="absolute -inset-4 bg-emerald-500/10 rounded-full blur-lg animate-pulse"></div>
      <img src='/music.png' alt='logo' className='size-20 relative animate-bounce' />
    </div>
    <div className='text-center space-y-2'>
      <h3 className='text-xl font-semibold text-white'>
        No conversation selected
      </h3>
      <p className='text-zinc-400 text-sm'>Choose a friend from the list to start chatting</p>
    </div>
  </div>
);