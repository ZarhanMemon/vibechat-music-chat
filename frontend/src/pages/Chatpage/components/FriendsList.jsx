import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import useUserStore from "../../../store/useUserStore.js";
import MyFriendsListSkeleton from "../../../components/MyFriendsListSkeleton.jsx";

const FriendsList = () => {
	const { myFriends, selectedUser, loading, setSelectedUser, onlineUsers } = useUserStore();

	if (!myFriends || myFriends.length === 0) {
		return (
			<div className='p-4 flex flex-col items-center justify-center h-full bg-zinc-900/30'>
				<div className="w-12 h-12 rounded-full bg-zinc-800/50 flex items-center justify-center mb-3">
					<span className="text-xl">👋</span>
				</div>
				<p className='text-zinc-400 text-sm text-center'>No friends yet</p>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col bg-zinc-900/30 backdrop-blur-sm'>
			{/* Header */}
			<div className='p-4 border-b border-zinc-800/50'>
				<h2 className='text-sm font-medium text-zinc-400'>
					Friends ({myFriends.length})
				</h2>
			</div>

			{/* Friends List */}
			<ScrollArea className='flex-1 px-2'>
				<div className='py-2 space-y-1'>
					{loading ? (
						<MyFriendsListSkeleton />
					) : (
						myFriends.map((friend) => (
							<div
								key={friend._id}
								onClick={() => setSelectedUser(friend)}
								className={`group flex items-center gap-3 p-3 rounded-lg cursor-pointer
									transition-all duration-300 hover:shadow-lg
									${selectedUser?.clerkId === friend.clerkId 
										? "bg-zinc-800/80 ring-1 ring-emerald-500/20 shadow-lg" 
										: "hover:bg-zinc-800/50"}`}
							>
								{/* Avatar with Online Indicator */}
								<div className='relative shrink-0'>
									<Avatar className='size-10 border-2 border-zinc-800/50 transition-colors duration-300 
										group-hover:border-zinc-700/50'>
										<AvatarImage src={friend.imageUrl} alt={friend.fullname} />
										<AvatarFallback className="bg-zinc-900 text-emerald-500">
											{(friend.fullname || '?')[0]}
										</AvatarFallback>
									</Avatar>
									<div
										className={`absolute bottom-0 right-0 size-3 rounded-full ring-2 ring-zinc-900
											transition-all duration-300 group-hover:scale-110
											${onlineUsers.has(friend.clerkId) 
												? "bg-emerald-500 " 
												: "bg-zinc-500"}`}
									/>
								</div>

								{/* Friend Info */}
								<div className='flex-1 min-w-0 lg:block hidden'>
									<p className='font-medium text-zinc-100 truncate mb-0.5'>
										{friend.fullname || 'Unnamed Friend'}
									</p>
									<p className={`text-xs ${onlineUsers.has(friend.clerkId) 
										? "text-emerald-400" 
										: "text-zinc-500"}`}>
									</p>
								</div>
							</div>
						))
					)}
				</div>
			</ScrollArea>
		</div>
	);
};

export default FriendsList;