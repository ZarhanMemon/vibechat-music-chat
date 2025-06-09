import { UserPlus, Check } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const RecommendedUserCard = ({ user, onSendRequest }) => {
  const [requestSent, setRequestSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendRequest = async () => {
    if (requestSent || isLoading) return;

    setIsLoading(true);
    try {
      await onSendRequest(user.clerkId);
      setRequestSent(true);
    } catch (error) {
      console.error("Error sending request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4 bg-zinc-900/50 hover:bg-zinc-800/50 transition-all duration-300 p-3 rounded-lg border border-zinc-800/50 hover:border-purple-500/30 backdrop-blur-sm group">
      
      {/* Avatar */}
      <Avatar className="h-12 w-12 border border-purple-500/20 group-hover:border-purple-500/40 transition-all">
        <AvatarImage src={user.imageUrl} alt={user.fullname} className="object-cover" />
        <AvatarFallback className="bg-zinc-900 text-purple-400">
          {(user.fullname || '?')[0]}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
          {user.fullname}
        </h3>
        <p className="text-sm text-zinc-400 truncate">Suggested for you</p>
      </div>

      {/* Add Friend Button */}
      <Button
        onClick={handleSendRequest}
        disabled={requestSent || isLoading}
        size="sm"
        variant="ghost"
        className={`shrink-0 transition-all duration-300 ${
          requestSent
            ? 'text-green-400 hover:text-green-400 hover:bg-green-500/10'
            : 'text-purple-400 hover:text-purple-300 hover:bg-purple-500/10'
        }`}
      >
        {isLoading ? (
          <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : requestSent ? (
          <Check className="size-4" />
        ) : (
          <UserPlus className="size-4" />
        )}
      </Button>
    </div>
  );
};

export default RecommendedUserCard;
