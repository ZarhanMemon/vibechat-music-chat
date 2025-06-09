import React, { useEffect } from 'react';
import TopBar from '../../components/TopBar';
import { ScrollArea } from '@/components/ui/scroll-area';
import FeaturedSection from './components/FeaturedSection';
import SectionGrid from './components/SectionGrid';
import SectionGridSkeleton from "./components/SectionGridSkeleton";
import useMusicStore from '../../store/useMusicStore';
import usePlayerStore from '../../store/usePlayerStore';

function HomePage() {
  const { 
    loading,
    featuredSongs,
    madeForYouSongs,
    trendingSongs,
    fetchFeaturedSongs,
    fetchMadeForYouSongs,
    fetchTrendingSongs,
  } = useMusicStore();

  const {initializeQueue} = usePlayerStore();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        await Promise.all([
          fetchFeaturedSongs(),
          fetchMadeForYouSongs(),
          fetchTrendingSongs(),
        ]);
      } catch (error) {
        console.error("Error fetching music data:", error);
      }
    };

    fetchAllData();
  }, []);


  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      // Initialize the player queue with the first song from each section
      const allsongs = [
        ...madeForYouSongs,
        ...featuredSongs,
        ...trendingSongs
      ];
      initializeQueue(allsongs);
    }
  
  }
  , [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs]);

  if (loading) {
    return (
      <main className='h-full bg-zinc-950'>
        <TopBar />
        <div className='p-6 space-y-8'>
          <div className="space-y-8 animate-pulse">
            <SectionGridSkeleton />
            <SectionGridSkeleton />
            <SectionGridSkeleton />
          </div>
        </div>
      </main>
    );
  }

  return (    
    <main className='relative h-full overflow-hidden bg-zinc-950'>
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/20 via-zinc-900/90 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-zinc-900/30 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <TopBar />

        <ScrollArea className='h-[calc(100vh-4rem)]'>
          <div className='p-6 space-y-16'>
            {/* Featured Section */}
            <div className='relative rounded-xl overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-emerald-500/0 to-transparent pointer-events-none' />
              <FeaturedSection songs={featuredSongs} loading={loading} />
            </div>

            {/* Made For You Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Made For You
                </h2>
                <div className="h-px flex-1 mx-8 bg-gradient-to-r from-transparent via-emerald-800/20 to-transparent" />
              </div>
              <SectionGrid songs={madeForYouSongs} loading={loading} />
            </section>

            {/* Trending Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  Trending Now
                </h2>
                <div className="h-px flex-1 mx-8 bg-gradient-to-r from-transparent via-emerald-800/20 to-transparent" />
              </div>
              <SectionGrid songs={trendingSongs} loading={loading} />
            </section>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

export default HomePage;
