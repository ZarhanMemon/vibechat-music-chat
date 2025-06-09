import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import LeftSidebar from './components/LeftSidebar';
import FriendActivity from './components/FriendActivity';
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from './components/PlaybackControls';


function MainLayout() {
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  return (<>   
   <div className="h-screen bg-black text-white flex flex-col">
    <ResizablePanelGroup
      direction="horizontal"
      className="flex-1 h-[calc(100vh-6rem)] overflow-hidden p-2"
    >

      {/* Left Sidebar */}
      <ResizablePanel
        defaultSize={20}
        minSize={isMobile ? 0 : 10}
        maxSize={30}
      >
        <LeftSidebar />
      </ResizablePanel>

      <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />

      {/* Main Content */}
      <ResizablePanel defaultSize={isMobile ? 80 : 60}>
        <Outlet />
      </ResizablePanel>

      {/* Right Sidebar (Desktop only) */}
      {!isMobile && (
        <>
          <ResizableHandle className="w-2 bg-black rounded-lg transition-colors" />
          <ResizablePanel
            defaultSize={20}
            minSize={0}
            maxSize={25}
            collapsedSize={0}
          >
            <FriendActivity />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>

    <PlaybackControls />


  </div>

    <AudioPlayer />


  </>
  );
}

export default MainLayout;
