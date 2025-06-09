import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useMusicStore from "../../store/useMusicStore.js";
import usePlayerStore from "../../store/usePlayerStore.js";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

function AlbumPage() {
  const { albumId: id } = useParams();
  const { fetchAlbumById, singleAlbum, loading } = useMusicStore();
  const {
    currentSong,
    isPlaying,
    playAlbum,
    togglePlayPause,
    initializeQueue,
    loopQueue,
    toggleLoopQueue,
  } = usePlayerStore();

  useEffect(() => {
    if (id) {
      fetchAlbumById(id);
    }
  }, [fetchAlbumById, id]);

  const handlePlayAlbum = () => {
    if (!singleAlbum) return;

    const songs = singleAlbum.songs || [];
    const isCurrentAlbumPlaying = songs.some(
      (song) => song._id === currentSong?._id
    );

    initializeQueue(songs);

    if (isCurrentAlbumPlaying) {
      togglePlayPause();
    } else {
      playAlbum(songs, 0);
    }
  };

  const handlePlaySong = (index) => {
    if (!singleAlbum?.songs) return;
    const selectedSong = singleAlbum.songs[index];

    if (currentSong?._id === selectedSong._id) {
      togglePlayPause();
    } else {
      const isInQueue = singleAlbum.songs.some(
        (song) => song._id === currentSong?._id
      );

      if (!currentSong || !isInQueue) {
        initializeQueue(singleAlbum.songs);
      }
      playAlbum(singleAlbum.songs, index);
    }
  };

  if (loading || !singleAlbum) return null;

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="relative h-full">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/30 via-zinc-900/90 to-zinc-950 pointer-events-none" />

          <div className="relative z-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row p-6 gap-8 pb-8">
              {/* Album Cover */}
              <div className="group relative">
                <img
                  src={singleAlbum.imgUrl}
                  alt={singleAlbum.title}
                  className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] shadow-2xl rounded-lg object-cover
                    transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-lg shadow-inner-lg bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
              </div>

              {/* Album Info */}
              <div className="flex flex-col justify-end">
                <h1 className="text-4xl md:text-6xl font-bold text-white">
                  {singleAlbum.title}
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 mt-2">
                {singleAlbum?.songs?.length && (
                  <span className="text-zinc-400">By • {singleAlbum.artist} • {singleAlbum.songs.length} songs</span>
                )}

                </p>
                      
              </div>
            </div>

            {/* Play Button and Loop Button (your original styles) */}
            <div className="px-6 pb-6 flex items-center gap-4">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 
                  hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20
                  transition-all duration-300"
              >
                {isPlaying && singleAlbum.songs.some((song) => song._id === currentSong?._id) ? (
                  <Pause className="h-7 w-7 text-zinc-900" />
                ) : (
                  <Play className="h-7 w-7 text-zinc-900" />
                )}
              </Button>

              <Button
                onClick={toggleLoopQueue}
                size="icon"
                className={cn(
                  "w-10 h-10 rounded-full transition-all duration-300",
                  loopQueue
                    ? "bg-emerald-500 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20"
                    : "bg-zinc-800/80 hover:bg-zinc-700/80"
                )}
                title={loopQueue ? "Disable album repeat" : "Enable album repeat"}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    loopQueue ? "text-zinc-900" : "text-zinc-400"
                  )}
                >
                  <path d="M17 2l4 4-4 4" />
                  <path d="M3 11v-1a4 4 0 014-4h14" />
                  <path d="M7 22l-4-4 4-4" />
                  <path d="M21 13v1a4 4 0 01-4 4H3" />
                </svg>
              </Button>
            </div>

            {/* Song List */}
            <div className="px-6 pb-10">
              {/* Table for desktop */}
              <div className="hidden md:block">
                <table className="w-full table-fixed border-collapse text-white">
                  <thead>
                    <tr className="border-b border-zinc-700">
                      <th className="w-10 px-2 py-3 text-left">#</th>
                      <th className="w-14 px-2 py-3 text-left">Cover</th>
                      <th className="text-left py-3">Title</th>
                      <th className="w-36 px-2 py-3 text-left">Duration</th>
                      <th className="w-36 px-2 py-3 text-left">Release Date</th>
                      <th className="w-12 px-2 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleAlbum.songs.map((song, index) => {
                      const isCurrent = currentSong?._id === song._id && isPlaying;
                      return (
                        <tr
                          key={song._id}
                          className={cn(
                            "cursor-pointer hover:bg-emerald-800/20 transition-colors",
                            isCurrent ? "bg-emerald-800/30" : ""
                          )}
                          onClick={() => handlePlaySong(index)}
                        >
                          <td className="text-center px-2 py-3">{index + 1}</td>
                          <td className="px-2 py-3">
                            <img
                              src={song.imgUrl}
                              alt={song.title}
                              className="w-10 h-10 rounded object-cover"
                            />
                          </td>
                          <td className="py-3">
                            <div>
                              <p className="font-medium">{song.title}</p>
                              <p className="text-xs text-muted-foreground">{song.artist}</p>
                            </div>
                          </td>
                          <td className="px-2 py-3 flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock size={14} />
                            {formatDuration(song.duration)}
                          </td>
                          <td className="px-2 py-3 text-sm text-muted-foreground">
                            {new Date(song.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>
                          <td className="px-2 py-3 text-center">
                            {isCurrent ? (
                              <Pause size={16} className="text-emerald-400" />
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* List for mobile */}
              <div className="md:hidden space-y-2">
                {singleAlbum.songs.map((song, index) => {
                  const isCurrent = currentSong?._id === song._id && isPlaying;
                  return (
                    <div
                      key={song._id}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-md hover:bg-emerald-800/20 transition",
                        isCurrent ? "bg-emerald-800/30" : ""
                      )}
                      onClick={() => handlePlaySong(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 text-center text-sm">{index + 1}</div>
                        <img
                          src={song.imgUrl}
                          alt={song.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{song.title}</p>
                          <p className="text-xs text-muted-foreground">{song.artist}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock size={14} />
                          {formatDuration(song.duration)}
                        </div>
                        {isCurrent ? (
                          <Pause size={18} className="text-emerald-400" />
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default AlbumPage;
