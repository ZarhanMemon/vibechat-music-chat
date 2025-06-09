import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';    
dotenv.config(); // Load environment variables from .env file

export const generateToken = (userId,res) => {

    // Generate a JWT token for the user

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });

    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        httpOnly: true,                   // Prevents XXS ATTACK/ client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',       // or 'None' if frontend is hosted elsewhere
    });

    return token
}
