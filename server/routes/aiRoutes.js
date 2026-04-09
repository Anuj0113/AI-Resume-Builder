import express from "express";
import protect from "../middlewares/authMiddleware.js"
import { enhanceProfessionalSummary, enhanceJobDescription, uploadResume, extractPdfText, scoreResume } from "../controllers/aiController.js";
import upload from "../configs/multer.js";

const aiRouter = express.Router();

aiRouter.post('/enhanced-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhanced-job-desc', protect, enhanceJobDescription)
aiRouter.post('/upload-resume', protect, uploadResume)
aiRouter.post('/extract-pdf', protect, upload.single('pdf'), extractPdfText)
aiRouter.post('/score-resume', protect, scoreResume)

export default aiRouter