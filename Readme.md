# 🎧 VibeChat – Real-Time Music & Messaging App

**VibeChat** is a full-stack real-time web application that blends **Spotify-style music streaming** with **real-time 1-on-1 chat**. Users can listen to music, track what their friends are listening to live, send friend requests, and chat — all in one seamless app powered by **Socket.io**, **React**, and **Clerk**.

> Experience music socially, not just personally. 🎵💬

---

## ✅ Features (Current Version)

- 🔐 **User Authentication**
  - Google Sign In/Sign Up via **Clerk**
  - Guests can browse and preview music
  - Authenticated users unlock full music + social features

- 🧑‍🤝‍🧑 **Friend System**
  - Send/Accept/Reject Friend Requests
  - View Incoming/Outgoing Requests
  - Track Total Friends and Recommended Users

- 🟢 **User Presence**
  - Live Online/Offline Status via **Socket.io**
  - “Active Now” section shows who’s listening to music
  - Real-time friend activity feed

- 💬 **1-on-1 Real-Time Messaging**
  - Instant chat with friends using **Socket.io**
  - Online indicator next to friend names
  - Custom styled message input component

- 🎵 **Music Player & Album System**
  - Home page with Recommended & Featured albums
  - Album pages with:
    - Play/Pause, Next/Previous track
    - Loop Song / Loop Album
    - Volume control
    - Song info preview (image, title, etc.)
  - Listen to songs your friends are playing – live

- 👤 **User Dashboard**
  - Personalized topbar with user name and navigation
  - Notifications section for friend request actions
  - Responsive layout for mobile and desktop

- 🛠️ **Admin Panel**
  - Add/Delete Albums and Songs
  - View user base
  - Manage full song and album library

---

## 🚀 Upcoming Features (Coming Soon)

- 👥 Group Chat System  
- 📀 Playlist Creation  
- 💌 Typing Indicators  
- 📱 Progressive Web App (PWA) Support  

---


## 📁 Folder Structure

```
vibechat-music-chats/
├── client/                   # Frontend (React + Tailwind + Clerk)
│   ├── components/           # UI components (Topbar, Player, Sidebar, etc.)
│   ├── pages/                # Pages like Home, Friends, Messages
│   ├── store/                # Zustand for global state
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Helper functions
│   ├── App.jsx               # Main App entry
│   └── main.jsx              # ReactDOM render logic
│
├── server/                   # Backend (Node.js + Express + Socket.io)
│   ├── controllers/          # Route handling logic
│   ├── routes/               # API endpoints
│   ├── models/               # MongoDB models
|   ├── lib/                # Helper functions
│   ├── socket/               # Socket.io server configuration
│   └── index.js              # Backend entry point
```

---

## 🛠 Tech Stack

| Part           | Technology                            |
|----------------|----------------------------------------|
| Frontend       | React, Tailwind CSS, ShadCN UI         |
| Backend        | Node.js, Express, Socket.IO            |
| Auth           | Clerk (Google OAuth)                   |
| Database       | MongoDB (Mongoose)                     |
| State Mgmt     | Zustand                                |
| Deployment     | Render                                 |
| Music Features | HTML5 Audio API                        |

---

## ⚙️ How to Run the Project Locally

### 1. Clone the Repository

```bash
git clone https://github.com/ZarhanMemon/vibechat-music-chats.git
cd vibechat-music-chats
```

### 2. Set Up Client

```bash
cd client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Then run:

```bash
npm run dev
```

### 3. Set Up Backend

```bash
cd ../server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret
```

Then run:

```bash
node index.js
```

Visit [http://localhost:5173](http://localhost:5173) to view the app.

---

## 📸 Screenshots

> You can replace these with your own later.

### 🖥️ Desktop Views

<p align="center">
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/6cec005d-ad47-4724-b249-590475e07708" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/d60df7a8-9153-4e71-ae5a-5106c30f9e79" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/5591805e-de01-4b43-8b5d-c76854437f58" />
<img width="960" alt="Image" src="https://github.com/user-attachments/assets/e282f52d-f45f-4497-a819-cfb59152ba6f" />
<img width="541" alt="Image" src="https://github.com/user-attachments/assets/3d0c54dd-c19b-4f6c-93e5-5bf981205e33" />
</p>

### 📱 Mobile Views

<p align="center">
 <img width="132" alt="Image" src="https://github.com/user-attachments/assets/58aa5e94-400b-44f7-a557-b5c8c2e0ce52" />
<img width="135" alt="Image" src="https://github.com/user-attachments/assets/b2edf86c-e8b5-4f68-bd63-e30648e031c2" />
<img width="135" alt="Image" src="https://github.com/user-attachments/assets/813f3c98-f19c-47b6-84d8-b7e4d5373abe" />
<img width="136" alt="Image" src="https://github.com/user-attachments/assets/5fd27fe2-9716-41d7-bc1d-c12fb3c822d8" />
<img width="135" alt="Image" src="https://github.com/user-attachments/assets/1b233fcf-c054-4014-bdac-9745417764f3" />
<img width="135" alt="Image" src="https://github.com/user-attachments/assets/07c19dcc-dfc4-40d8-b1a2-54f1bd9881c4" />
<img width="135" alt="Image" src="https://github.com/user-attachments/assets/8b1cdba5-a74e-4a7f-a695-facbbe9ec38c" />
</p>

---


## 🙏 Credits

Thanks to:

- [Clerk.dev](https://clerk.dev)
- [Socket.io](https://socket.io)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN UI](https://ui.shadcn.dev/)

---


## ⚠️ Known Issue

While capturing sample screenshots for this project, we encountered a **bug** where:

> When receiving messages through the socket connection, the **same message appears twice** in the chat interface.

This is likely due to a duplicate event listener or repeated state update.  
The issue is currently under investigation and will be addressed in a future patch.  
It does **not** affect core functionalities during testing or demonstration.

---


## 📄 License

This project is licensed under the **MIT License**.

---

## 🌐 Live Project

🎧 Try the live version now:  
🔗 [https://vibechat-music-chat.onrender.com](https://vibechat-music-chat.onrender.com)
