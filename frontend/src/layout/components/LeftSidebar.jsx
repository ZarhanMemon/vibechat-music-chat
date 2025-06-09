import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/clerk-react";
import { HomeIcon, Library, MessageCircle, UsersIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PlaylistSkeleton from "../../components/PlaylistSkeleton";
import useMusicStore from "../../store/useMusicStore";
import useUserStore from "../../store/useUserStore";
import { useEffect } from "react";

function LeftSidebar() {
  const isLoading = false;
  const { albums, fetchAlbums } = useMusicStore();
  const { incomingFriendRequests, unreadMessages } = useUserStore();
  const location = useLocation();

  const hasPendingRequests = incomingFriendRequests?.length > 0;
  const hasUnreadMessages = unreadMessages?.length > 0;
  const isHome = location.pathname === "/";
  const isFriends = location.pathname === "/friends";
  const isChat = location.pathname === "/chat";
  const currentAlbumId = location.pathname.startsWith("/album/")
    ? location.pathname.split("/")[2]
    : null;

  useEffect(() => {
    fetchAlbums();
  }, [fetchAlbums]);

  return (
    <div className="h-full flex flex-col gap-3">
      {/* Navigation menu */}
      <div className="rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 p-4 shadow-lg shadow-black/10">
        <div className="space-y-2">
          <Link
            to="/"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: cn(
                  "w-full justify-start transition-colors duration-300",
                  isHome
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-zinc-100 hover:text-emerald-400 hover:bg-zinc-800/80"
                ),
              })
            )}
          >
            <HomeIcon className="mr-2 size-5" />
            <span className="hidden md:inline">Home</span>
          </Link>

          <SignedIn>
            <Link
              to="/friends"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: cn(
                    "w-full justify-start transition-colors duration-300",
                    isFriends
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-zinc-100 hover:text-emerald-400 hover:bg-zinc-800/80"
                  ),
                })
              )}
            >
              <div className="relative">
                <UsersIcon
                  className={cn("mr-2 size-5", isFriends && "text-emerald-400")}
                />
                {hasPendingRequests && (
                  <div
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse"
                    title={`${incomingFriendRequests.length} pending friend request${
                      incomingFriendRequests.length > 1 ? "s" : ""
                    }`}
                  />
                )}
              </div>
              <span className="hidden md:inline">Friends</span>
            </Link>

            <Link
              to="/chat"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  className: cn(
                    "w-full justify-start transition-colors duration-300",
                    isChat
                      ? "text-emerald-400 hover:text-emerald-300"
                      : "text-zinc-100 hover:text-emerald-400 hover:bg-zinc-800/80"
                  ),
                })
              )}
            >
              <div className="relative">
                <MessageCircle
                  className={cn("mr-2 size-5", isChat && "text-emerald-400")}
                />
                {hasUnreadMessages && (
                  <div
                    className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse"
                    title={`${unreadMessages.length} unread message${
                      unreadMessages.length > 1 ? "s" : ""
                    }`}
                  />
                )}
              </div>
              <span className="hidden md:inline">Messages</span>
            </Link>
          </SignedIn>
        </div>
      </div>

      {/* Library section */}
      <div className="flex-1 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 p-4 shadow-lg shadow-black/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-zinc-100 px-2">
            <Library className="size-5 mr-2 text-emerald-400" />
            <span className="hidden md:inline font-medium">Your Library</span>
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-20rem)]">
          <div className="space-y-2 pr-4">
            {isLoading ? (
              <PlaylistSkeleton />
            ) : (
              albums.map((album) => (
                <Link
                  to={`/album/${album._id}`}
                  key={album._id}
                  className={cn(
                    "p-2 rounded-lg flex items-center gap-3 group cursor-pointer transition-all duration-300",
                    currentAlbumId === album._id
                      ? "bg-zinc-800/80 shadow-md shadow-black/10"
                      : "hover:bg-zinc-800/80 hover:shadow-md hover:shadow-black/10"
                  )}
                >
                  <img
                    src={album.imgUrl}
                    alt="Playlist img"
                    className={cn(
                      "size-8 md:size-12 rounded-lg flex-shrink-0 object-cover shadow-md transition-transform duration-300",
                      currentAlbumId === album._id ? "scale-105" : "group-hover:scale-105"
                    )}
                  />

                  <div className="flex-1 min-w-0 hidden md:block">
                    <p
                      className={cn(
                        "font-medium truncate transition-colors duration-300",
                        currentAlbumId === album._id
                          ? "text-emerald-400"
                          : "text-zinc-100 group-hover:text-emerald-400"
                      )}
                    >
                      {album.title}
                    </p>
                    <p
                      className={cn(
                        "text-sm truncate transition-colors duration-300",
                        currentAlbumId === album._id
                          ? "text-zinc-300"
                          : "text-zinc-400 group-hover:text-zinc-300"
                      )}
                    >
                      Songs • {album.songs.length > 0 ? album.songs.length : "..."}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default LeftSidebar;
