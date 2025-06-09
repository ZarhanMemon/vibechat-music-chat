import React, { useEffect } from 'react';
import useMusicStore from '../../../store/useMusicStore';
import { Library, ListMusic, PlayCircle, Users2 } from "lucide-react";

function DashBoard() {
  const { stats, fetchStats } = useMusicStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (!stats) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-zinc-400'>Loading stats...</div>
      </div>
    );
  }

  const statItems = [
    {
      label: 'Total Songs',
      value: stats.totalSongs,
      icon: ListMusic,
      bgColor: 'bg-emerald-600/20',
      iconColor: 'text-emerald-400',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: Users2,
      bgColor: 'bg-blue-600/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Total Albums',
      value: stats.totalAlbums,
      icon: Library,
      bgColor: 'bg-orange-600/20',
      iconColor: 'text-orange-400',
    },
    {
      label: 'Total Artists',
      value: stats.totalArtist,
      icon: PlayCircle,
      bgColor: 'bg-pink-600/20',
      iconColor: 'text-pink-400',
    },
  ];

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 px-2 sm:px-0'>
      {statItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300 shadow-sm"
        >
          <div className="flex flex-col">
            <span className="text-sm text-zinc-400">{item.label}</span>
            <span className="text-xl font-semibold text-white">{item.value}</span>
          </div>
          <div className={`p-2 rounded-full ${item.bgColor}`}>
            <item.icon className={`h-5 w-5 ${item.iconColor}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashBoard;
