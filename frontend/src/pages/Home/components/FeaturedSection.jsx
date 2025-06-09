import React from "react";
import SectionGridSkeleton from "./SectionGridSkeleton";
import PlayButton from "./PlayButton.jsx";
import { Button } from "../../../components/ui/button";

const FeaturedSection = ({ title = "Featured Tracks", songs, loading }) => {
  if (loading) return <SectionGridSkeleton />;

  if (!songs || songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-4">
          <span className="text-2xl">🎵</span>
        </div>
        <p className="text-zinc-400 text-sm text-center">
          No featured songs available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
          {title}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/80"
        >
          See All
        </Button>
      </div>

      {/* Featured Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {songs.map((song) => (
          <div
            key={song._id}
            className="group relative bg-zinc-900/50 hover:bg-zinc-800/50 backdrop-blur-sm 
              p-4 rounded-xl border border-zinc-800/50 hover:border-zinc-700/50
              flex items-center gap-4 transition-all duration-300
              hover:shadow-lg hover:shadow-emerald-500/5"
          >
            {/* Song Image */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
              <img
                src={song.imgUrl}
                alt={song.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300" />
            </div>

            {/* Song Details */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3 className="text-base font-medium text-zinc-100 truncate group-hover:text-emerald-400 transition-colors duration-300">
                {song.title}
              </h3>
              <p className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors duration-300">
                {song.artist}
              </p>
            </div>

            {/* Play Button */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-1 
              group-hover:translate-y-0 transition-all duration-300">
              <PlayButton song={song} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSection;
