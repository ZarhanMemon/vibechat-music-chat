import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware } from '@clerk/express';
import fileUpload from 'express-fileupload';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './lib/db.js';
import cron from 'node-cron';
import fs from 'fs';


// Route Imports
import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import adminRoute from './routes/adminRoute.js';
import songsRoute from './routes/songsRoute.js';
import albumRoute from './routes/albumRoute.js';
import statesRoute from './routes/statesRoute.js';

// Socket.IO Imports
// Note: Ensure you have socket.io installed in your project
import { createServer } from 'http';
import {initializeSocketIO} from "./lib/socket.js" ; // Import socket.io initialization




// Load environment variables
dotenv.config();

// Get correct __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate essential env vars
if (!process.env.PORT || !process.env.ADMIN_EMAIL || !process.env.CLERK_SECRET_KEY) {
  console.error("❌ Missing essential environment variables in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT ;

//creating socket.io server inside express app
const SocketServer = createServer(app);
initializeSocketIO(SocketServer);


// Middleware
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(clerkMiddleware()); // Adds req.auth

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, 'temp'),
    createParentPath: true,
    limits:{
      fileSize: 10* 1024*1024  //10MB MAX file size
    }
  })
);


// Cron cleanup (adjusted to match temp directory)
cron.schedule("0 * * * *", () => {
	if (fs.existsSync(tempDir)) {
		fs.readdir(tempDir, (err, files) => {
			if (err) {
				console.log("error", err);
				return;
			}
			for (const file of files) {
				fs.unlink(path.join(tempDir, file), (err) => {});
			}
		});
	}
});




// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/songs', songsRoute);
app.use('/api/album', albumRoute);
app.use('/api/states', statesRoute);

// Start Server after DB Connection

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(clientBuildPath));
  // Catch-all must come **after** static & API routes
  app.get('/*', (_, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// error handler
app.use((err, req, res, next) => {
	res.status(500).json({ message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message });
});


connectDB()
  .then(async () => {
    
    SocketServer.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Failed to connect to database:', err.message);
    process.exit(1);
  });



  // SOcket.io working todo