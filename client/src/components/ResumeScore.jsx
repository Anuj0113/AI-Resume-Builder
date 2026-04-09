import React, { useState } from 'react'
import { Sparkles, LoaderCircle, X, CheckCircle, AlertCircle, TrendingUp, Shield } from 'lucide-react'
import api from '../configs/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ResumeScore = ({ resumeData }) => {
    const { token } = useSelector(state => state.auth)
    const [isLoading, setIsLoading] = useState(false)
    const [score, setScore] = useState(null)
    const [isOpen, setIsOpen] = useState(false)

    const getScore = async () => {
        setIsLoading(true)
        setIsOpen(true)
        try {
            const { data } = await api.post('/api/ai/score-resume',
                { resumeData },
                { headers: { Authorization: token } }
            )
            setScore(data)
        } catch (error) {
            toast.error('Failed to score resume')
            setIsOpen(false)
        }
        setIsLoading(false)
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-500'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Average'
        return 'Needs Work'
    }

    return (
        <>
            <button onClick={getScore}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors font-medium'>
                <Sparkles className='size-3.5' /> ATS Score
            </button>

            {isOpen && (
                <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center px-4 pt-16 pb-4'>
    <div className='bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl'>
                        {/* Header */}
                        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
                            <div className='flex items-center gap-3'>
                                <div className='size-10 bg-yellow-100 rounded-xl flex items-center justify-center'>
                                    <Sparkles className='size-5 text-yellow-600' />
                                </div>
                                <div>
                                    <h2 className='text-lg font-semibold text-gray-800'>ATS Resume Score</h2>
                                    <p className='text-xs text-gray-400'>AI-powered resume analysis</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)}
                            className='p-2 hover:bg-gray-100 rounded-xl transition-colors'>
                                <X className='size-5 text-gray-400' />
                            </button>
                        </div>

                        {isLoading ? (
                            <div className='flex flex-col items-center justify-center py-20 gap-4'>
                                <LoaderCircle className='size-12 animate-spin text-yellow-500' />
                                <p className='text-gray-500'>Analyzing your resume...</p>
                                <p className='text-xs text-gray-400'>This may take a few seconds</p>
                            </div>
                        ) : score && (
                            <div className='p-6 space-y-6'>
                                {/* Overall Score */}
                                <div className='flex items-center gap-6 p-6 bg-gray-50 rounded-2xl'>
                                    <div className='relative size-24'>
                                        <svg className='size-24 -rotate-90' viewBox='0 0 36 36'>
                                            <path d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                                            fill='none' stroke='#e5e7eb' strokeWidth='3' />
                                            <path d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                                            fill='none'
                                            stroke={score.overall_score >= 80 ? '#16a34a' : score.overall_score >= 60 ? '#d97706' : '#dc2626'}
                                            strokeWidth='3'
                                            strokeDasharray={`${score.overall_score}, 100`} />
                                        </svg>
                                        <div className='absolute inset-0 flex items-center justify-center'>
                                            <span className={`text-2xl font-bold ${getScoreColor(score.overall_score)}`}>
                                                {score.overall_score}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className={`text-3xl font-bold ${getScoreColor(score.overall_score)}`}>
                                            {getScoreLabel(score.overall_score)}
                                        </p>
                                        <p className='text-gray-500 text-sm mt-1'>Overall ATS Score</p>
                                        <div className='mt-3 h-2 w-48 bg-gray-200 rounded-full overflow-hidden'>
                                            <div className={`h-full rounded-full transition-all ${getScoreBg(score.overall_score)}`}
                                            style={{ width: `${score.overall_score}%` }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Scores */}
                                <div>
                                    <h3 className='font-semibold text-gray-800 mb-3'>Section Breakdown</h3>
                                    <div className='space-y-3'>
                                        {Object.entries(score.sections).map(([key, val]) => (
                                            <div key={key} className='flex items-center gap-3'>
                                                <p className='text-sm text-gray-600 w-36 capitalize'>
                                                    {key.replace('_', ' ')}
                                                </p>
                                                <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                                                    <div className={`h-full rounded-full ${getScoreBg(val.score)}`}
                                                    style={{ width: `${val.score}%` }} />
                                                </div>
                                                <span className={`text-sm font-semibold w-8 text-right ${getScoreColor(val.score)}`}>
                                                    {val.score}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Strengths */}
                                <div className='bg-green-50 rounded-2xl p-4'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <CheckCircle className='size-5 text-green-600' />
                                        <h3 className='font-semibold text-green-800'>Strengths</h3>
                                    </div>
                                    <ul className='space-y-2'>
                                        {score.strengths.map((s, i) => (
                                            <li key={i} className='flex items-start gap-2 text-sm text-green-700'>
                                                <span className='text-green-500 mt-0.5'>✓</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Improvements */}
                                <div className='bg-red-50 rounded-2xl p-4'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <AlertCircle className='size-5 text-red-500' />
                                        <h3 className='font-semibold text-red-800'>Improvements Needed</h3>
                                    </div>
                                    <ul className='space-y-2'>
                                        {score.improvements.map((imp, i) => (
                                            <li key={i} className='flex items-start gap-2 text-sm text-red-700'>
                                                <span className='text-red-400 mt-0.5'>→</span> {imp}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* ATS Tips */}
                                <div className='bg-blue-50 rounded-2xl p-4'>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <Shield className='size-5 text-blue-600' />
                                        <h3 className='font-semibold text-blue-800'>ATS Optimization Tips</h3>
                                    </div>
                                    <ul className='space-y-2'>
                                        {score.ats_tips.map((tip, i) => (
                                            <li key={i} className='flex items-start gap-2 text-sm text-blue-700'>
                                                <span className='text-blue-400 mt-0.5'>•</span> {tip}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button onClick={getScore}
                                className='w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2'>
                                    <TrendingUp className='size-4' /> Re-analyze Resume
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default ResumeScore