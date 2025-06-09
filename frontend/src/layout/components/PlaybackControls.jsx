import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Repeat,
  Volume1,
 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import usePlayerStore from "../../store/usePlayerStore";

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong,
    toggleLoop,
    loop,
  } = usePlayerStore();

  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  // Get audio element once
  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;
    audioRef.current = audio;
    audio.volume = volume / 100;
  }, []);

  // Time + duration handling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };

    const handleError = (e) => {
      console.error("Audio error:", e);
      setError("Error playing audio");
    };

    update();
    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", update);
    audio.addEventListener("durationchange", update);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", update);
      audio.removeEventListener("durationchange", update);
      audio.removeEventListener("error", handleError);
    };
  }, [currentSong]);

  // Seek
  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
    }
  };

  // Volume control
  const handleVolumeChange = (value) => {
    const newVol = value[0];
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol / 100;
    }
  };


  return (
    <footer className="w-full px-4 py-3 bg-zinc-900 border-t border-zinc-800 flex  flex-row md:items-center md:justify-between gap-4">
      {/* Song Info */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        {currentSong && (
          <>
            <img
              src={currentSong.imgUrl}
              alt={currentSong.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="text-sm">
              <p className="font-semibold text-white">{currentSong.title}</p>
              <p className="text-zinc-400">{currentSong.artist}</p>
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center justify-center flex-grow gap-2">
        <div className="flex items-center gap-4">
          <Button size="icon" variant="ghost" onClick={previousSong}>
            <SkipBack size={20} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full p-2"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </Button>
          <Button size="icon" variant="ghost" onClick={nextSong}>
            <SkipForward size={20} />
          </Button>
          <Button size="icon" variant={loop ? "default" : "ghost"} onClick={toggleLoop}>
            <Repeat size={20} />
          </Button>
        </div>

        {/* Seek bar */}
        <div className="w-full flex items-center gap-2 text-xs text-zinc-300">
          <span>{formatTime(currentTime)}</span>
          <Slider
            className="flex-grow"
            min={0}
            max={duration}
            step={1}
            value={[currentTime]}
            onValueChange={handleSeek}
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center gap-2 w-48">
        <Volume1 className="text-white" />
        <Slider
          min={0}
          max={100}
          step={1}
          value={[volume]}
          onValueChange={handleVolumeChange}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-red-500">
          {error}
        </div>
      )}
    </footer>
  );
};
