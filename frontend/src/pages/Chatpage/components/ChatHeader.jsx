import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUserStore from "../../../store/useUserStore";

const ChatHeader = () => {
	const { selectedUser, onlineUsers } = useUserStore();

	if (!selectedUser) return null;

	return (		
	<div className='px-6 py-4 border-b border-zinc-800/50 bg-black/30 backdrop-blur-sm'>
			<div className='flex items-center gap-4 max-w-3xl mx-auto'>
				<Avatar className="size-10 border-2 border-zinc-800/50">
					<AvatarImage src={selectedUser.imageUrl} />
					<AvatarFallback className="bg-zinc-900 text-emerald-500">{selectedUser.fullname[0]}</AvatarFallback>
				</Avatar>
				<div>
					<h2 className='font-medium text-lg text-zinc-100'>{selectedUser.fullname}</h2>
					<p className='text-sm flex items-center gap-2'>
						{onlineUsers.has(selectedUser.clerkId) ? (
							<>
								<span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
								<span className="text-emerald-400">Online</span>
							</>
						) : (
							<>
								<span className="size-2 rounded-full bg-zinc-500" />
								<span className="text-zinc-400">Offline</span>
							</>
						)}
					</p>
				</div>
			</div>
		</div>
	);
};
export default ChatHeader;