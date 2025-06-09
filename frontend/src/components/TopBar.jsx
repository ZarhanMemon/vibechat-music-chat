import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { LayoutDashboardIcon, BellIcon, UsersIcon, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import useAuthStore from "@/store/useAuthStore";
import useUserStore from "@/store/useUserStore";
import logo from "@/logo/music.png";

function TopBar() {
  const { isAdmin } = useAuthStore();
  const { incomingFriendRequests } = useUserStore();
  const hasPendingRequests = incomingFriendRequests?.length > 0;

  return (
    <div className='flex items-center justify-between p-3 sticky top-0 bg-zinc-900 backdrop-blur-md z-10'>
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center space-x-1.5 group">
          <span className="text-2xl font-bold text-green-500 group-hover:text-green-700 transition-colors duration-300">
            Vibe<span className="text-white">Chat</span>
          </span>
        </Link>
      </div>

      <div className='flex items-center gap-1.5'>
        <SignedIn>
          <nav className="flex items-center gap-1">
            <Link
              to="/chat"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50"
              )}
              title="Messages"
            >
              <MessageSquare className=" size-6" />
            </Link>

            <Link
              to="/notification"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/50 relative"
              )}
              title="Notifications"
            >
              <BellIcon className=" size-6" />
              {hasPendingRequests && (
                <div
                  className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500"
                  title={`${incomingFriendRequests.length} pending request${incomingFriendRequests.length > 1 ? "s" : ""}`}
                />
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "text-zinc-400  hover:text-emerald-400 hover:bg-zinc-800/50"
                )}
                title="Admin Dashboard"
              >
                <LayoutDashboardIcon className=" size-6" />
              </Link>
            )}
          </nav>
        </SignedIn>

        <SignedOut>
          <SignInOAuthButtons />
        </SignedOut>

        <UserButton />
      </div>
    </div>
  );
}

export default TopBar;
