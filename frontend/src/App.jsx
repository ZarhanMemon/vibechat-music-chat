import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import NotificationPage from "./pages/NotificationPage/NotificationPage";
import AlbumPage from "./pages/Album/AlbumPage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useEffect } from 'react';

import { Toaster } from "react-hot-toast";
import MainLayout from "./layout/MainLayout";
import FriendsPage from "./pages/FriendPage/FriendsPage";
import AdminPage from "./pages/admin/AdminPage";
import ChatPage from "./pages/Chatpage/Chatpage";
import useUserStore from './store/useUserStore';
import NotFoundPage from "./pages/404/NotFoundPage";

export default function App() {
  const initializeSocketListeners = useUserStore((state) => state.initializeSocketListeners);

  useEffect(() => {
    initializeSocketListeners();
  }, [initializeSocketListeners]);

  return (<>
      <Routes>
        <Route
          path='/sso-callback'
          element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
        />

        <Route path='/auth-callback' element={<AuthCallbackPage />} />

        <Route path='/admin' element={<AdminPage/>} />

        <Route element={<MainLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/album/:albumId" element={<AlbumPage />} />
          <Route path="/chat" element={<ChatPage/>}/>
          <Route path="/*" element={<NotFoundPage/>} />
        </Route>

      </Routes>
      <Toaster />
    </>
  );
}