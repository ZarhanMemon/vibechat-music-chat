import React, { useEffect } from 'react';
import useUserStore from '@/store/useUserStore';
import TopBar from '@/components/TopBar';
import FriendCard from '@/components/FriendCard';
import NoFriendsFound from '@/components/NoFriendFound';
import RecommendedUserCard from '@/components/RecommendedUserCard';
import { useUser } from "@clerk/clerk-react";

export default function FriendsPage() {
  const {
    myFriends,
    onlineUsers,
    userActivities,
    fetchMyFriends,
    recommendedUsers,
    fetchRecommendedUsers,
    sendFriendRequest,
    loading,
  } = useUserStore();

  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      fetchMyFriends();
      fetchRecommendedUsers();
    }
  }, [isLoaded, user]);

  const handleSendRequest = (userId) => sendFriendRequest(userId);

  if (!isLoaded || loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-900">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-green-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-zinc-400">Loading friends...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <main className="min-h-[calc(100vh-64px)] bg-black text-white relative">
        <div className="absolute inset-0 bg-grid-white/[0.02] -z-0"></div>
        <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 relative z-10">

          {/* Stats Section - scrollable on mobile, scrollbar hidden */}
          <div className="overflow-x-auto max-w-full whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
              {[
                {
                  label: "Total Friends",
                  value: myFriends?.length || 0,
                  color: "from-blue-400 to-cyan-400",
                  bgColor: "bg-blue-400/5",
                  borderColor: "border-blue-400/20",
                  icon: "👥"
                },
                {
                  label: "Online",
                  value: myFriends?.filter(f => onlineUsers?.has(f.clerkId)).length || 0,
                  color: "from-emerald-400 to-green-400",
                  bgColor: "bg-emerald-400/5",
                  borderColor: "border-emerald-400/20",
                  icon: "🟢"
                },
                {
                  label: "Active Now",
                  value: myFriends?.filter(f => userActivities?.get(f.clerkId) && userActivities?.get(f.clerkId) !== "Idle").length || 0,
                  color: "from-purple-400 to-pink-400",
                  bgColor: "bg-purple-400/5",
                  borderColor: "border-purple-400/20",
                  icon: "⚡"
                },
                {
                  label: "Recommendations",
                  value: recommendedUsers?.length || 0,
                  color: "from-amber-400 to-orange-400",
                  bgColor: "bg-amber-400/5",
                  borderColor: "border-amber-400/20",
                  icon: "✨"
                }
              ].map(({ label, value, bgColor, borderColor, icon }, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border ${bgColor} ${borderColor} shadow-sm min-w-[200px]`}
                >
                  <div className="text-sm text-zinc-400">{label}</div>
                  <div className="mt-1 text-2xl font-semibold text-white flex items-center gap-2">
                    {icon} {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Friends List */}
          <section>
            <h2 className="text-xl font-semibold mb-4">My Friends</h2>
            {myFriends?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {myFriends.map(friend => (
                  <FriendCard key={friend.clerkId} friend={friend} onlineUsers={onlineUsers} />))}
              </div>
            ) : (
              <NoFriendsFound text={"friends"} />)}
          </section>

          {/* Recommended Users */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Recommended Friends</h2>
            {recommendedUsers?.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {recommendedUsers.map(user => (
                  <RecommendedUserCard
                    key={user.clerkId}
                    user={user}
                    onSendRequest={() => handleSendRequest(user.clerkId)}
                  />
                ))}
              </div>
            ) : (
              <NoFriendsFound text={"recommended users"} />)}
          </section>
        </div>
      </main>
    </>
  );
}
