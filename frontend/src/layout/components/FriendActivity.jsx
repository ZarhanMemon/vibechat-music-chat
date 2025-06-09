import React, { useEffect } from 'react';
import useUserStore from '../../store/useUserStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser } from "@clerk/clerk-react";
import { HeadphonesIcon, Users, Music } from 'lucide-react';

const FriendActivity = () => {
  const { myFriends, fetchMyFriends, onlineUsers, setSelectedUser, userActivities } = useUserStore();
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user?.id) {
      fetchMyFriends();
    }
  }, [isLoaded, user?.id, fetchMyFriends]);

  if (!isLoaded) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (!user) return <LoginPrompt />;

  return (
    <div className="h-full bg-zinc-900/50 backdrop-blur-sm rounded-lg flex flex-col border border-zinc-800/50">
      <div className="p-4 flex justify-between items-center border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-emerald-400" />
          <h2 className="font-medium text-zinc-100">Friend Activity</h2>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-1">
          {myFriends.length > 0 ? (
            myFriends.map((friend) => {
              const activity = userActivities.get(friend.clerkId);
              const isPlaying = activity && activity !== "Idle";
              return (
                <div
                  key={friend._id}
                  onClick={() => setSelectedUser(friend)}
                  aria-label={`View ${friend.fullname}'s activity`}
                  className="group cursor-pointer hover:bg-zinc-700/50 p-3 rounded-lg transition-all duration-300
                    hover:shadow-lg hover:shadow-emerald-500/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="size-10 border-2 border-zinc-800/50 group-hover:border-emerald-500/20 transition-colors duration-300">
                        <AvatarImage src={friend.imageUrl || '/default-avatar.png'} alt={friend.fullname} />
                        <AvatarFallback className="bg-zinc-900 text-emerald-500">{(friend.fullname || '?')[0]}</AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900 transition-transform duration-300
                          ${onlineUsers.has(friend.clerkId) 
                            ? "bg-emerald-500 group-hover:scale-110 " 
                            : "bg-zinc-500"}`}
                        aria-hidden='true'
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-zinc-100 group-hover:text-emerald-400 transition-colors duration-300 truncate">
                          {friend.fullname || 'Unnamed Friend'}
                        </span>
                        {isPlaying && (
                          <Music className="size-3.5 text-emerald-400 animate-[pulse_2s_ease-in-out_infinite]" />
                        )}
                      </div>

                      {isPlaying ? (
                        <div className='mt-1.5 space-y-0.5'>
                          <div className='text-sm text-zinc-200 font-medium truncate group-hover:text-emerald-400/90 transition-colors duration-300'>
                            {activity.replace("Playing ", "").split(" by ")[0]}
                          </div>
                          <div className='text-xs text-zinc-400 truncate group-hover:text-zinc-300 transition-colors duration-300'>
                            by {activity.split(" by ")[1]}
                          </div>
                        </div>
                      ) : (
                        <div className='mt-1 text-xs text-zinc-500'>Idle</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="mb-4 p-4 rounded-full bg-zinc-800/50 ring-1 ring-zinc-700/50 backdrop-blur-sm">
                <Users className="size-6 text-emerald-400" />
              </div>
              <h4 className="text-sm font-medium text-zinc-200 mb-2">No Active Friends</h4>
              <p className="text-xs text-zinc-400 max-w-[200px]">
                Add some friends to see what they're listening to
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

const LoginPrompt = () => (
  <div className="h-full flex flex-col items-center justify-center p-6 text-center space-y-4 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800/50">
    <div className="relative">
      <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-lg opacity-75 animate-pulse" />
      <div className="relative bg-zinc-800/50 rounded-full p-4 ring-1 ring-zinc-700/50">
        <HeadphonesIcon className="size-8 text-emerald-400" />
      </div>
    </div>

    <div className="space-y-2 max-w-[250px]">
      <h3 className="text-lg font-medium text-zinc-100">See What Friends Are Playing</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">
        Login to discover what music your friends are enjoying right now
      </p>
    </div>
  </div>
);

export default FriendActivity;
