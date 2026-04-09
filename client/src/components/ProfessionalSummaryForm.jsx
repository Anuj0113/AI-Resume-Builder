import React, { useState } from 'react'
import { Sparkles, LoaderCircle } from 'lucide-react'
import api from '../configs/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ProfessionalSummaryForm = ({ data, onChange }) => {
    
    const { token } = useSelector((state) => state.auth)
    const [isGenerating, setIsGenerating] = useState(false)
    const maxChars = 600
    
    const generateSummary = async () => {
        try {
            setIsGenerating(true)
            const { data: res } = await api.post('/api/ai/enhanced-pro-sum', { userContent: data }, { headers: { Authorization: token } })
            onChange(res.enhancedContent)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enhance summary')
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div className='space-y-5'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Professional Summary</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>A brief overview of your professional background</p>
                </div>
                <button onClick={generateSummary} disabled={isGenerating}
                className='flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all font-medium disabled:opacity-60 shadow-sm'>
                    {isGenerating ? (<LoaderCircle className='size-4 animate-spin'/>) : (<Sparkles className='size-4' />)}
                    {isGenerating ? 'Enhancing...' : 'AI Enhance'}
                </button>
            </div>

            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3'>
                <p className='text-xs text-blue-700 dark:text-blue-400 font-medium mb-1'>💡 Tips for a great summary:</p>
                <ul className='text-xs text-blue-600 dark:text-blue-400 space-y-0.5 list-disc list-inside'>
                    <li>Keep it 3-4 sentences long</li>
                    <li>Highlight your years of experience and key skills</li>
                    <li>Mention your biggest achievement</li>
                    <li>Use AI Enhance for better chance of getting job</li>
                    <li>Tailor it to the job you're applying for</li>
                </ul>
            </div>

            <div className='relative'>
                <textarea
                rows={8}
                className='w-full p-4 border border-gray-200 dark:border-gray-600 text-sm rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none text-gray-700 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700'
                placeholder='e.g. Results-driven Full Stack Developer with 3+ years of experience...'
                value={data || ""}
                onChange={(e) => {
                    if (e.target.value.length <= maxChars) onChange(e.target.value)
                }} />
                <div className={`absolute bottom-3 right-3 text-xs ${(data?.length || 0) >= maxChars ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`}>
                    {data?.length || 0}/{maxChars}
                </div>
            </div>
        </div>
    )
}

export default ProfessionalSummaryForm