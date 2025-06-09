import { create } from 'zustand';
import useUserStore from './useUserStore';

const usePlayerStore = create((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queueSongs: [],
  currentSongIndex: 0,
  loading: false,
  error: null,

  // Loop states
  loop: false,
  loopQueue: false,

  toggleLoop: () => set((state) => ({ loop: !state.loop })),
  toggleLoopQueue: () => set((state) => ({ loopQueue: !state.loopQueue })),

  // Volume control
  volume: 0.8,
  setVolume: (value) => set({ volume: Math.max(0, Math.min(1, value)) }),

  // Emit user activity
  updateActivity: (activity) => {
    const socket = useUserStore.getState().socket;
    if (socket?.connected && socket?.auth?.userId) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity,
      });
    }
  },

  // Initialize queue
  initializeQueue: (songs) => {
    if (!songs?.length) return;
    const { currentSong, isPlaying, updateActivity } = get();

    const newCurrentSong = currentSong && songs.some((s) => s._id === currentSong._id)
      ? currentSong
      : songs[0];

    const newIndex = songs.findIndex((s) => s._id === newCurrentSong._id);

    set({
      queueSongs: songs,
      currentSong: newCurrentSong,
      currentSongIndex: newIndex,
      isPlaying: currentSong && songs.some((s) => s._id === currentSong._id) ? isPlaying : false,
    });

    if (newCurrentSong && isPlaying) {
      updateActivity(`Listening to ${newCurrentSong.title} by ${newCurrentSong.artist}`);
    }
  },

  // Play an album from a given index
  playAlbum: (songs, startIndex = 0) => {
    if (!songs?.length) return;

    const socket = useUserStore.getState().socket;
    const startSong = songs[startIndex];

    set({
      queueSongs: songs,
      currentSong: startSong,
      currentSongIndex: startIndex,
      isPlaying: true,
    });

    if (socket?.connected && socket?.auth?.userId) {
      socket.emit('update_activity', {
        userId: socket.auth.userId,
        activity: `Listening to ${startSong.title} by ${startSong.artist}`,
      });
    }
  },

  // Toggle play/pause
  togglePlayPause: () => {
    const { currentSong, isPlaying, updateActivity } = get();
    if (!currentSong) return;

    const newIsPlaying = !isPlaying;
    set({ isPlaying: newIsPlaying });

    updateActivity(
      newIsPlaying
        ? `Listening to ${currentSong.title} by ${currentSong.artist}`
        : 'Idle'
    );
  },

  // Set a specific song as current
  setCurrentSong: (song) => {
    if (!song) return;
    const { queueSongs, updateActivity } = get();

    const idx = queueSongs.findIndex((s) => s._id === song._id);
    if (idx === -1) {
      set((state) => ({
        queueSongs: [...state.queueSongs, song],
        currentSong: song,
        currentSongIndex: state.queueSongs.length,
        isPlaying: true,
      }));
    } else {
      set({
        currentSong: song,
        currentSongIndex: idx,
        isPlaying: true,
      });
    }

    updateActivity(`Listening to ${song.title} by ${song.artist}`);
  },

  // Next song in queue
  nextSong: () => {
    const { currentSongIndex, queueSongs, loop, loopQueue, updateActivity } = get();
    if (loop) return;

    let newIndex = currentSongIndex + 1;

    if (newIndex >= queueSongs.length) {
      if (loopQueue) newIndex = 0;
      else return set({ isPlaying: false });
    }

    const nextSong = queueSongs[newIndex];
    set({
      currentSong: nextSong,
      currentSongIndex: newIndex,
      isPlaying: true,
    });

    updateActivity(`Listening to ${nextSong.title} by ${nextSong.artist}`);
  },

  // Previous song in queue
  previousSong: () => {
    const { currentSongIndex, queueSongs, updateActivity } = get();
    if (currentSongIndex === 0) return;

    const prevIndex = currentSongIndex - 1;
    const prevSong = queueSongs[prevIndex];

    set({
      currentSong: prevSong,
      currentSongIndex: prevIndex,
      isPlaying: true,
    });

    updateActivity(`Listening to ${prevSong.title} by ${prevSong.artist}`);
  },

  // Clear the player
  clearPlayer: () => {
    set({
      currentSong: null,
      isPlaying: false,
      queueSongs: [],
      currentSongIndex: 0,
      loop: false,
      loopQueue: false,
    });
  },
}));

export default usePlayerStore;
