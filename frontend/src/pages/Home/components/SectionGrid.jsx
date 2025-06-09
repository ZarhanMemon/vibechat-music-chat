import React from "react";
import { Button } from "../../../components/ui/button";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton.jsx";

const SectionGrid = ({ title, songs, loading }) => {
  if (loading) return <SectionGridSkeleton />;

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="group relative bg-zinc-900/50 hover:bg-zinc-800/50 backdrop-blur-sm
              p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50
              transition-all duration-300 cursor-pointer 
              hover:shadow-lg hover:shadow-emerald-500/5"
          >
            <div className="space-y-4">
              {/* Song Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-black/20">
                <img
                  src={song.imgUrl}
                  alt={song.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
              </div>

              {/* Song Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-zinc-100 truncate group-hover:text-emerald-400 transition-colors duration-300">
                    {song.title}
                  </h3>
                  <p className="text-sm text-zinc-400 truncate mt-1 group-hover:text-zinc-300 transition-colors duration-300">
                    {song.artist}
                  </p>
                </div>

                {/* Play Button */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-1 
                  group-hover:translate-y-0 transition-all duration-300">
                  <PlayButton song={song} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGrid;
