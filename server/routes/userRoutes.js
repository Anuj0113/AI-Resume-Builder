import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { registerUser, loginUser, getUserById, getUserResumes, googleLogin, forgotPassword, resetPassword } from '../controllers/UserController.js';
import protect from '../middlewares/authMiddleware.js';

// Google OAuth strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/users/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    done(null, profile)
}))

const userRouter = express.Router();

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/data', protect, getUserById)
userRouter.get('/resumes', protect, getUserResumes)

// Forgot/Reset Password routes
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)

// Google OAuth routes
userRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
userRouter.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleLogin)

export default userRouter