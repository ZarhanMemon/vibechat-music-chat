import React, { useEffect, useRef } from 'react';
import usePlayerStore from '../../store/usePlayerStore';

function AudioPlayer() {
    const audioRef = useRef(null);
    const previousSongRef = useRef(null);
    
    const {
        currentSong,
        isPlaying,
        nextSong,
        loop,
        loopQueue,
    } = usePlayerStore();

    // Handle play/pause logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.play().catch((err) => console.error("Audio play error:", err));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    // Load new song when currentSong changes
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentSong) return;

        if (previousSongRef.current !== currentSong._id) {
            previousSongRef.current = currentSong._id;
            audio.src = currentSong.audioUrl || currentSong.url;
            audio.currentTime = 0;
            audio.load();

            if (isPlaying) {
                audio.play().catch((err) => console.error("Audio auto-play error:", err));
            }
        }
    }, [currentSong, isPlaying]);

    // Handle end of song and looping
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = async () => {
            try {
                if (loop) {
                    // Loop single song
                    audio.currentTime = 0;
                    await audio.play().catch(err => {
                        console.error("Failed to restart song:", err);
                        // If autoplay fails, at least reset the position
                        audio.currentTime = 0;
                    });
                } else {
                    // Go to next song (playNext handles queue looping)
                    nextSong();
                }
            } catch (err) {
                console.error("Error in playback loop:", err);
            }
        };

        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("ended", handleEnded);
        };
    }, [loop, loopQueue, nextSong]);

    return <audio ref={audioRef} preload="auto" />;
}

export default AudioPlayer;
