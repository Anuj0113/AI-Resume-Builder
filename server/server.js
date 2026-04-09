import "dotenv/config";
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRoter from './routes/userRoutes.js';
import resumeRouter from './routes/resumeRoutes.js';
import aiRouter from './routes/aiRoutes.js'
import passport from 'passport'

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB()

app.use(express.json())
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://ai-resume-builder-frontend.onrender.com'  // replace with your actual Render frontend URL
    ],
    credentials: true
}))
app.use(passport.initialize())


app.get('/', (req,res)=> res.send("Server is live"))
app.use('/api/users', userRoter)
app.use('/api/resumes', resumeRouter)
app.use('/api/ai', aiRouter)


app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});