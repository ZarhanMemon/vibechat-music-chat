import React, { useEffect } from 'react';
import useMusicStore from '../../store/useMusicStore';
import useAuthStore from '../../store/useAuthStore';
import { Music, Album } from 'lucide-react';
import Header from './components/Header';
import DashBoard from './components/DashBoard';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import SongTabContent from './components/SongsTabContent';
import AlbumContent from './components/AlbumTabContent';

function AdminPage() {
  const { isAdmin, error } = useAuthStore();
  const { fetchAlbums, fetchAllSongs, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchAlbums();
    fetchAllSongs();
    fetchStats();
  }, [fetchAlbums, fetchAllSongs, fetchStats]);

  if (!isAdmin && !error) {
    return (
      <div className='text-center text-red-500'>
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className='relative min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden'>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-900/90 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-900/30 to-transparent pointer-events-none" />

      <div className="relative z-10 p-6 lg:p-8 space-y-8">
        <Header />
        <DashBoard />

        <Tabs defaultValue="songs" className='space-y-3'>
          <TabsList className='p-1 bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-lg'>
            <TabsTrigger
              value="songs"
              className='data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30 border border-transparent transition-all duration-300 hover:text-emerald-400/80'
            >
              <Music className='mr-2 size-4' />
              <span>Songs</span>
            </TabsTrigger>

            <TabsTrigger
              value="album"
              className='data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30 border border-transparent transition-all duration-300 hover:text-emerald-400/80'
            >
              <Album className='mr-2 size-4' />
              <span>Albums</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="songs" className="mt-3">
            <SongTabContent />
          </TabsContent>
          <TabsContent value="album" className="mt-3">
            <AlbumContent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminPage;
