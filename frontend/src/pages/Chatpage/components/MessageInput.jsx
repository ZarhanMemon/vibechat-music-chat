import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { Send } from "lucide-react";
import { useState } from "react";
import useUserStore from "../../../store/useUserStore";
import { cn } from "@/lib/utils";

const MessageInput = () => {
	const [newMessage, setNewMessage] = useState("");
	const { user } = useUser();
	const { selectedUser, sendMessage } = useUserStore();

	const handleSend = async () => {
		if (!selectedUser || !user || !newMessage.trim()) return;

		try {
			const messageData = {
				sender: user.id,
				recipient: selectedUser.clerkId,
				content: newMessage.trim(),
				sentAt: new Date().toISOString(),
				read: false
			};
			await sendMessage(messageData);
			setNewMessage("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	return (		
	<div className='px-4 py-6 mt-auto border-t border-zinc-800/50 bg-black/20 backdrop-blur-sm'>
			<div className='flex gap-2 items-center max-w-3xl mx-auto'>
				<Input
					placeholder='Type a message...'
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					className='bg-zinc-800/50 border-zinc-700/50 focus:border-emerald-500/50 focus:ring-emerald-500/20 
						rounded-xl px-4 py-5 h-11 text-sm transition-all duration-300
						placeholder:text-zinc-500 hover:bg-zinc-800/80'
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							handleSend();
						}
					}}
				/>
				<Button
					size='icon'
					onClick={handleSend}
					disabled={!newMessage.trim()}
					className={cn(
						"rounded-lg size-11 transition-all duration-300 shadow-lg",
						newMessage.trim()
							? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
							: "bg-zinc-800/50 text-zinc-500 shadow-none"
					)}
				>
					<Send className='size-4 transition-transform group-hover:translate-x-0.5 duration-300' />
				</Button>
			</div>
		</div>
	);
};

export default MessageInput;