import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import api from '../configs/api'
import { ArrowLeft, Download, LoaderCircle } from 'lucide-react'

const Preview = () => {
    const { resumeId } = useParams()
    const [isLoading, setIsLoading] = useState(true)
    const [resumeData, setResumeData] = useState(null)
    const [error, setError] = useState(false)


    const loadResume = async () => {
        try {
            const { data } = await api.get('/api/resumes/public/' + resumeId)
            setResumeData(data.resume)
        } catch (error) {
            console.log(error.message)
            setError(true)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadResume()
    }, [])

    if (isLoading) return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className='flex flex-col items-center gap-3'>
                <LoaderCircle className='size-10 animate-spin text-green-500' />
                <p className='text-gray-400 text-sm'>Loading resume...</p>
            </div>
        </div>
    )

    if (error || !resumeData) return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4'>
            <div className='text-center'>
                <div className='text-8xl mb-6'>📄</div>
                <h1 className='text-3xl font-bold text-gray-800 mb-2'>Resume Not Found</h1>
                <p className='text-gray-500 mb-8'>This resume doesn't exist or is set to private</p>
                <Link to='/'
                className='inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors'>
                    <ArrowLeft className='size-4' /> Go to Home
                </Link>
            </div>
        </div>
    )

    return (
        <div className='min-h-screen bg-gray-100'>
            {/* Top Bar */}
            <div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
                <div className='max-w-4xl mx-auto px-4 py-3 flex items-center justify-between'>
                    <Link to='/' className='flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm'>
                        <ArrowLeft className='size-4' /> Home
                    </Link>
                    <div className='flex items-center gap-2'>
                        <img src='/logo.svg' alt='logo' className='h-8 w-auto' />
                    </div>
                    <button onClick={() => window.print()}
                    className='flex items-center gap-2 px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors'>
                        <Download className='size-4' /> Download
                    </button>
                </div>
            </div>

            {/* Resume */}
            <div className='max-w-4xl mx-auto py-8 px-4'>
                <div className='bg-white rounded-2xl shadow-lg overflow-hidden'>
                    <ResumePreview
                    data={resumeData}
                    template={resumeData.template}
                    accentColor={resumeData.accent_color} />
                </div>

                {/* Footer CTA */}
                <div className='mt-8 text-center'>
                    <p className='text-gray-500 text-sm mb-3'>Want to create your own professional resume?</p>
                    <Link to='/login?state=register'
                    className='inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors shadow-sm'>
                        Create Your Resume — It's Free
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Preview