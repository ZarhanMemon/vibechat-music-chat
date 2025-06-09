import { Users } from "lucide-react";

const NoFriendsFound = ({ text }) => {
  return (
    <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-xl p-4 text-center shadow-md backdrop-blur-sm w-full max-w-sm mx-auto">
      <div className="flex justify-center mb-2">
        <div className="bg-zinc-800 p-2 rounded-full shadow-sm">
          <Users className="text-green-400 w-5 h-5" />
        </div>
      </div>

      <h3 className="font-semibold text-base bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
        No {text} found
      </h3>
    </div>
  );
};

export default NoFriendsFound;
