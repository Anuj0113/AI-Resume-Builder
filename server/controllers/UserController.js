import User from '../models/User.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Resume from '../models/Resume.js';
import { sendPasswordResetEmail } from '../configs/email.js'
import crypto from 'crypto'


const generateToken = (userId) =>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn: '7d'})
    return token;
}

//Controller for user registartion
//POST : api/users/register
export const registerUser = async (req,res) => {
    try {
        const {name,email,password} = req.body;

        //Check if required field are present
        if(!name || !email || !password){
            return res.status(404).json({message : "Missing required fields"})
        }

        //Check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(404).json({message : "User already exists"})
        }

        //Create a new user
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = await User.create({
            name,email,password:hashedPassword
        })

        //Return success message
        const token = generateToken(newUser._id)
        newUser.password = undefined;

        return res.status(201).json({message: "User created suceessfully" , token , user:newUser})


    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

export const googleLogin = async (req, res) => {
    try {
        const { displayName, emails, photos } = req.user
        const email = emails[0].value

        let user = await User.findOne({ email })

        if (!user) {
            // Register new user
            user = await User.create({
                name: displayName,
                email,
                password: Math.random().toString(36).slice(-8), // random password
                image: photos[0].value
            })
        }

        const token = generateToken(user._id)
        user.password = undefined

        // Redirect to frontend with token
        res.redirect(`http://localhost:5173/login?token=${token}`)

    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

//Controller for user login
// POST : /api/users/login

export const loginUser = async (req,res) => {
    console.log("LOGIN HIT", req.body) // 👈 add this
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        console.log("USER FOUND:", user ? "yes" : "no") // 👈 add this

        if(!user){
            return res.status(400).json({message: "Invalid email or password"})
        }

        console.log("COMPARING:", password, "WITH:", user.password) // 👈 add this
        const isMatch = await bcrypt.compare(password, user.password)
        console.log("IS MATCH:", isMatch) // 👈 add this

        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"})
        }

        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({message: "Login successfully", token, user})

    } catch (error) {
        console.log("LOGIN ERROR:", error.message) // 👈 add this
        return res.status(400).json({message: error.message})
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: 'Email is required' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(200).json({ message: 'If this email exists, a reset link has been sent' })
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        user.resetPasswordToken = resetToken
        user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000
        await user.save()

        // resetUrl is defined here INSIDE the function ✅
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
        await sendPasswordResetEmail(email, resetUrl)

        return res.status(200).json({ message: 'Password reset email sent successfully' })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Missing required fields' })
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpiry = undefined
        await user.save()

        return res.status(200).json({ message: 'Password reset successfully' })

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}

//Controller for getting user by ID
// GET : /api/users/data

export const getUserById = async (req,res) => {
    try {
        const userId = req.userId;

        //Check if user exists
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        //Return user
        user.password = undefined;
            return res.status(200).json({user})


    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//Controller for getting resume
//GET : /api/users/resumes

export const getUserResumes = async(req,res) =>{
    try {
        const userId = req.userId;

        //return user resumes
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}