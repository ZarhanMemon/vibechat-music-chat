import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';

const useMusicStore = create((set) => ({

  // STATE
  featuredSongs: [],
  allSongs: [],
  madeForYouSongs: [],
  trendingSongs: [],
  albums: [],
  loading: false,
  error: null,
  singleAlbum: null,

  stats:{
    totalSongs: 0,
    totalAlbums: 0,
    totalArtists: 0,
    totalUsers: 0,
  },


  
  // ACTIONS
  fetchFeaturedSongs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/songs/featured');
      set({ featuredSongs: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false});
    }
  },

  fetchAllSongs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/songs');
      set({ allSongs: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false});
    }
  },

  fetchMadeForYouSongs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/songs/made-for-you');
      set({ madeForYouSongs: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false});
    }
  },

  fetchTrendingSongs: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/songs/trending');
      set({ trendingSongs: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false});
    }
  },

  fetchAlbums: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/album/getAlbum');
      set({ albums: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false});
    }
  },

  fetchAlbumById: async (albumId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(`/album/${albumId}`);
      set({ singleAlbum: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false });
    }
  },
  addSong: async (formData) => {
    set({ loading: true, error: null });
    try {      
      const { data } = await axiosInstance.post('/admin/create-song', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
        
      if (!data.newSong) {
        throw new Error('No song data received from server');
      }
      
      set((state) => ({
        allSongs: [data.newSong, ...state.allSongs],
      }));

    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    }
    finally {
      set({ loading: false });
    }
  },

  addAlbum: async (albumData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.post('/admin/create-album', albumData);
      set((state) => ({
        albums: [...state.albums, data],
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    }
    finally {
      set({ loading: false });
    }
  },

  deleteAlbum: async (albumId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/delete-album/${albumId}`);
      set((state) => ({
        albums: state.albums.filter((album) => album._id !== albumId),
        singleAlbum: null,
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false });
    }
  },


  deleteSong: async (songId) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.delete(`/admin/delete-song/${songId}`);
      set((state) => ({
        allSongs: state.allSongs.filter((song) => song._id !== songId),
        featuredSongs: state.featuredSongs.filter((song) => song._id !== songId),
        madeForYouSongs: state.madeForYouSongs.filter((song) => song._id !== songId),
        trendingSongs: state.trendingSongs.filter((song) => song._id !== songId),
      }));
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false });
    }
  },


  fetchStats: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get('/states');
      set({ stats: data });
    } catch (error) {
      set({ error: error?.response?.data?.message || error.message || 'Something went wrong' });
    } finally {
      set({ loading: false });
    }
  },


}));

export default useMusicStore;
