import React,{useEffect} from 'react';
import useUserStore from '../../store/useUserStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle } from 'lucide-react';

const IncomingRequests = ({ requests, onAccept, onReject }) => {
  if (!requests.length) {
    return (
      <p className="text-zinc-400 text-center italic select-none px-4 py-8">
        No new friend requests.
      </p>
    );
  }

  return (
    <ScrollArea className="max-h-[400px]">
      {requests.map((req) => (
        <div
          key={req._id}
          className="bg-zinc-900/50 hover:bg-zinc-800/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 shadow-lg border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 group hover:border-emerald-500/30"
        >
          <div className="flex items-center gap-3 sm:gap-5 min-w-0">
            <div className="relative flex-shrink-0">
              <img
                src={req?.sender?.imageUrl || 'https://via.placeholder.com/50'}
                alt={req?.sender?.fullname || 'User'}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-zinc-600/50 group-hover:border-emerald-500/50 transition-colors duration-300"
              />
              <div className="absolute inset-0 rounded-full bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <p className="text-white font-semibold text-base sm:text-lg truncate group-hover:text-emerald-400 transition-colors duration-300 min-w-0">
              {req?.sender?.fullname}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4 justify-start sm:justify-end">
            <button
              onClick={() => onAccept(req._id)}
              className="p-2 sm:p-3 rounded-full hover:bg-emerald-500/20 transition-all duration-300 group/btn"
              aria-label={`Accept friend request from ${req?.sender?.fullname}`}
            >
              <CheckCircle
                size={28}
                className="text-emerald-400 group-hover/btn:scale-110 transition-transform"
              />
            </button>
            <button
              onClick={() => onReject(req._id)}
              className="p-2 sm:p-3 rounded-full hover:bg-red-500/20 transition-all duration-300 group/btn"
              aria-label={`Reject friend request from ${req?.sender?.fullname}`}
            >
              <XCircle
                size={28}
                className="text-red-400 group-hover/btn:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

const OutgoingRequests = ({ requests }) => {
  if (!requests.length) return null;

  return (
    <>
      <h3 className="text-lg font-semibold mt-8 mb-4 text-zinc-200 border-t border-zinc-800/50 pt-6 select-none flex items-center gap-2 px-4 sm:px-0">
        Outgoing Requests
      </h3>
      <ScrollArea className="max-h-[300px]">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-zinc-900/50 hover:bg-zinc-800/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-5 relative border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 group hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <time className="text-xs text-zinc-500 hidden md:block select-none mb-2 absolute top-4 right-4 opacity-75 group-hover:opacity-100 group-hover:text-emerald-400/70 transition-all duration-300">
              {new Date(req.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={req?.recipient?.imageUrl || 'https://via.placeholder.com/50'}
                  alt={req?.recipient?.fullname || 'User'}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-zinc-600/50 group-hover:border-emerald-500/50 transition-colors duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-semibold text-white text-base sm:text-lg truncate group-hover:text-emerald-400 transition-colors duration-300">
                  {req?.recipient?.fullname}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                    Status:{' '}
                    <span
                      className={
                        req.status === 'pending'
                          ? 'text-amber-400'
                          : req.status === 'accepted'
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }
                    >
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};

const RejectedRequests = ({ requests }) => {
  if (!requests.length) return null;

  return (
    <>
      <h3 className="text-lg font-semibold mt-8 mb-4 text-zinc-200 border-t border-zinc-800/50 pt-6 select-none flex items-center gap-2 px-4 sm:px-0">
        Rejected Requests
      </h3>
      <ScrollArea className="max-h-[300px]">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-zinc-900/50 hover:bg-zinc-800/50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-5 relative border border-zinc-700/50 backdrop-blur-sm transition-all duration-300 group hover:border-red-500/30 hover:shadow-lg hover:shadow-red-500/5"
          >
            <time className="text-xs text-zinc-500 select-none mb-2 hidden md:block absolute top-4 right-4 opacity-75 group-hover:opacity-100 group-hover:text-red-400/70 transition-all duration-300">
              {new Date(req.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </time>
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  src={req?.recipient?.imageUrl || 'https://via.placeholder.com/50'}
                  alt={req?.recipient?.fullname || 'User'}
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-zinc-600/50 group-hover:border-red-500/50 transition-colors duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-red-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="font-semibold text-white text-base sm:text-lg truncate group-hover:text-red-400 transition-colors duration-300">
                  {req?.recipient?.fullname}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                    Status:{' '}
                    <span className="text-red-400">Rejected</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
};

export { IncomingRequests, OutgoingRequests, RejectedRequests };



const NotificationPage = () => {
  const {
    incomingFriendRequests,
    rejectedFriendRequests,
    outgoingFriendRequests,
    fetchFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    loading,
    error,
  } = useUserStore();
  useEffect(() => {
    const loadRequests = async () => {
      try {
        await fetchFriendRequests();
        console.log('Friend Requests loaded:', {
          incoming: incomingFriendRequests,
          outgoing: outgoingFriendRequests,
          rejected: rejectedFriendRequests
        });
      } catch (error) {
        console.error('Error loading friend requests:', error);
      }
    };
    
    loadRequests();
  }, [fetchFriendRequests]);

  const handleAccept = async (requestId) => {
    await acceptFriendRequest(requestId);
    await fetchFriendRequests();
  };

  const handleReject = async (requestId) => {
    await rejectFriendRequest(requestId);
    await fetchFriendRequests();
  };




  if (loading) {
    return (
      <div className="h-full bg-zinc-950 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 animate-pulse" />
          <p className="text-zinc-400 animate-pulse">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="relative h-full bg-zinc-950">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-900/90 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-900/30 to-transparent pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-6 h-full flex flex-col gap-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
            Notifications
          </h2>
        </div>

        <ScrollArea className="flex-1 h-[calc(100vh-10rem)] rounded-xl border border-zinc-800/50 
          bg-zinc-900/50 backdrop-blur-sm p-6 shadow-xl">
          <IncomingRequests
            requests={incomingFriendRequests}
            onAccept={handleAccept}
            onReject={handleReject}
          />
          <OutgoingRequests requests={outgoingFriendRequests} />
          <RejectedRequests requests={rejectedFriendRequests} />
        </ScrollArea>
      </div>
    </main>
  );
};

export default NotificationPage;
