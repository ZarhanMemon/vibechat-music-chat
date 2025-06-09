import { Link } from 'react-router-dom';
import { MessageSquare, Music } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import useUserStore from '@/store/useUserStore';

const FriendCard = ({ friend, onlineUsers }) => {
  const { setSelectedUser, userActivities } = useUserStore();

  const activity = userActivities.get(friend.clerkId);
  const isOnline = onlineUsers?.has(friend.clerkId);
  const isPlaying = activity && activity !== "Idle";

  return (
    <Link
      to="/chat"
      onClick={() => setSelectedUser(friend)}
      className="block w-full transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300 rounded-xl border border-zinc-800/50 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/10 backdrop-blur-sm group p-4">
        <div className="flex items-center gap-4">
          
          {/* Avatar + online dot */}
          <div className="relative shrink-0">
            <Avatar className="w-12 h-12 border-2 border-zinc-800/50 group-hover:border-emerald-400/50 transition-colors">
              <AvatarImage src={friend.imageUrl} alt={friend.fullname} />
              <AvatarFallback className="bg-zinc-900 text-emerald-400">
                {(friend.fullname || "?")[0]}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-zinc-900 transition-transform duration-300 group-hover:scale-110 
              ${isOnline ? "bg-emerald-500" : "bg-zinc-500"}`}
              title={isOnline ? "Online" : "Offline"}
            />
          </div>

          {/* Name + Activity */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-md text-white group-hover:text-emerald-400 truncate transition-colors duration-300">
                {friend.fullname}
              </h3>
              {isPlaying && (
                <Music 
                  className="w-4 h-4 text-emerald-400 animate-[pulse_2s_ease-in-out_infinite]" 
                  title="Currently playing music" 
                />
              )}
            </div>
            {isPlaying && (
              <p className="text-sm text-zinc-400 group-hover:text-zinc-300 truncate mt-0.5">
                {activity?.replace("Playing ", "").split(" by ")[0]}
              </p>
            )}
          </div>

          {/* Chat Button */}
          <div className="p-2.5 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-white transition-all duration-300 transform group-hover:scale-105">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FriendCard;
