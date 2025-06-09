import { clerkClient } from "@clerk/express";
import dotenv from "dotenv";
dotenv.config()

export const protectAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization header missing or invalid" });
        }

        if (!req.auth?.userId) {
            return res.status(401).json({ message: "Unauthorized - you must be logged in" });
        }

        // Verify the token with Clerk if needed
        try {
            await clerkClient.users.getUser(req.auth.userId);
        } catch (error) {
            return res.status(401).json({ message: "Invalid authentication token" });
        }

        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ message: "Internal server error during authentication" });
    }
};

export const checkAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
		const isAdmin = process.env.ADMIN_EMAIL === currentUser.primaryEmailAddress?.emailAddress;

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};