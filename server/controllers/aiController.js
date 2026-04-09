import Resume from '../models/Resume.js';
import ai from "../configs/ai.js";
import { readFileSync } from 'fs'
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs'
//Controller for enhancing resume
//POST : api/ai/enhance-pro-sum



export const enhanceProfessionalSummary = async(req,res) =>{
    try {
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message: "Missing required field"})

        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentence also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else"
            
        },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//Controller for JD
//POST : api/ai/enhance-job-desc

export const enhanceJobDescription = async(req,res) =>{
    try {
        const {userContent} = req.body;

        if(!userContent){
            return res.status(400).json({message: "Missing required field"})
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly and only return text no options or anything else"
            
        },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

export const extractPdfText = async (req, res) => {
    try {
        console.log("EXTRACT PDF HIT")
        if(!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' })
        }

        const fileBuffer = readFileSync(req.file.path)
        const uint8Array = new Uint8Array(fileBuffer)
        
        const pdf = await getDocument({ data: uint8Array }).promise
        let fullText = ''
        
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const textContent = await page.getTextContent()
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
            fullText += pageText + '\n'
        }

        console.log("PDF TEXT:", fullText)
        return res.status(200).json({ text: fullText })

    } catch (error) {
        console.log("PDF ERROR:", error.message)
        return res.status(400).json({ message: error.message })
    }
}

//Controller for uploading resume to DB
//POST : api/ai/upload-resume

export const uploadResume = async(req,res) =>{
    try {
        
        const {resumeText , title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message: "Missing required field"})
        }


        const systemPrompt = "You are an expert AI agent to extarct data from resume";

        const userPrompt = `You are a resume parser. Extract information from the resume text below and return ONLY a valid JSON object.

Resume text:
"""
${resumeText}
"""

Return this exact JSON structure with no extra text, no markdown, no backticks:
{
    "professional_summary": "extract the summary/objective section text",
    "skills": ["each individual skill as separate string item"],
    "personal_info": {
        "image": "",
        "full_name": "persons full name",
        "profession": "job title or profession if mentioned",
        "email": "email address",
        "phone": "phone number with country code",
        "location": "city and country if present",
        "linkedin": "linkedin URL or profile link if present",
        "website": "personal website if present"
    },
    "experience": [
        {
            "company": "company name",
            "position": "job position title",
            "start_date": "YYYY-MM format",
            "end_date": "YYYY-MM format or empty string if current",
            "description": "full description text",
            "is_current": false
        }
    ],
    "projects": [
    {
        "name": "project name only",
        "type": "technology or project type", 
        "description": "Start with dates like 'Apr 2025 - Present | ' then full description. Example: 'Apr 2025 - Present | Developed & implemented...'"
    }
],
    "education": [
        {
            "institute": "university or college name only - never include certifications or online courses here",
            "degree": "degree type like Bachelors Masters etc",
            "field": "field of study",
            "graduation_date": "YYYY-MM format - convert year ranges like 2023-2026 to graduation year 2026-01",
            "gpa": ""
        }
    ]
}
        `;
        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
    messages: [
        {   role: "system",
            content: systemPrompt
            
        },
        {
            role: "user",
            content: userPrompt,
        },
    ],
    response_format : {type : "json_object"}
        })

        const extractedData = response.choices[0].message.content;
        const parsedData = JSON.parse(extractedData)
        const newResume = await Resume.create({userId, title, ...parsedData})

        res.json({resumeId:newResume._id})
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}

export const scoreResume = async (req, res) => {
    try {
        const { resumeData } = req.body

        if (!resumeData) {
            return res.status(400).json({ message: 'Resume data is required' })
        }

        const prompt = `You are an expert ATS (Applicant Tracking System) and resume reviewer.
        
Analyze this resume data and return ONLY a JSON object with no extra text:

${JSON.stringify(resumeData)}

Return this exact JSON:
{
    "overall_score": <number 0-100>,
    "sections": {
        "personal_info": { "score": <0-100>, "feedback": "<one line feedback>" },
        "professional_summary": { "score": <0-100>, "feedback": "<one line feedback>" },
        "experience": { "score": <0-100>, "feedback": "<one line feedback>" },
        "education": { "score": <0-100>, "feedback": "<one line feedback>" },
        "skills": { "score": <0-100>, "feedback": "<one line feedback>" },
        "projects": { "score": <0-100>, "feedback": "<one line feedback>" }
    },
    "improvements": [
        "<specific improvement suggestion 1>",
        "<specific improvement suggestion 2>",
        "<specific improvement suggestion 3>",
        "<specific improvement suggestion 4>",
        "<specific improvement suggestion 5>"
    ],
    "strengths": [
        "<strength 1>",
        "<strength 2>",
        "<strength 3>"
    ],
    "ats_tips": [
        "<ATS optimization tip 1>",
        "<ATS optimization tip 2>",
        "<ATS optimization tip 3>"
    ]
}`

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
                { role: "system", content: "You are an expert resume reviewer and ATS specialist. Always return valid JSON only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        })

        const result = JSON.parse(response.choices[0].message.content)
        return res.status(200).json(result)

    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
}