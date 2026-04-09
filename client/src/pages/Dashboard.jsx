import React, { useEffect, useState } from 'react'
import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon, FileText, CopyIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import api from '../configs/api'

const Modal = ({ title, onClose, onSubmit, children }) => (
  <div onClick={onClose} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4'>
    <div onClick={e => e.stopPropagation()} className='relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl'>
      <button onClick={onClose} className='absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
        <XIcon className='size-5 text-gray-400' />
      </button>
      <h2 className='text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6'>{title}</h2>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  </div>
)

const Dashboard = () => {

  const { user, token } = useSelector(state => state.auth);
  const colors = ['#9333ea', '#d97706', '#dc2626', '#0284c7', '#16a34a']
  const [allResumes, setAllResumes] = useState([])
  const [showCreateResume, setShowCreateResume] = useState(false)
  const [showUploadResume, setShowUploadResume] = useState(false)
  const [title, setTitle] = useState('')
  const [resume, setResume] = useState(null)
  const [editResumeId, setEditResumeId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const loadAllResumes = async () => {
    try {
      const { data } = await api.get('/api/users/resumes', { headers: { Authorization: token } })
      setAllResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const duplicateResume = async (resumeId) => {
    try {
        const { data } = await api.post(`/api/resumes/duplicate/${resumeId}`, {}, { headers: { Authorization: token } })
        setAllResumes([...allResumes, data.resume])
        toast.success('Resume duplicated!')
    } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
    }
}

  const createResume = async (event) => {
    try {
      event.preventDefault()
      const { data } = await api.post('/api/resumes/create', { title }, { headers: { Authorization: token } })
      setAllResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const pdfFormData = new FormData()
      pdfFormData.append('pdf', resume)
      const { data: pdfData } = await api.post('/api/ai/extract-pdf', pdfFormData, {
        headers: { Authorization: token }
      })
      const { data } = await api.post('/api/ai/upload-resume',
        { title, resumeText: pdfData.text },
        { headers: { Authorization: token } }
      )
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      navigate(`/app/builder/${data.resumeId}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false)
  }

  const editTitle = async (event) => {
    try {
      event.preventDefault()
      await api.put(`/api/resumes/update/${editResumeId}`, { resumeId: editResumeId, resumeData: { title } }, { headers: { Authorization: token } })
      setAllResumes(allResumes.map(resume => resume._id === editResumeId ? { ...resume, title } : resume))
      setTitle('')
      setEditResumeId('')
      toast.success('Title updated successfully')
    } catch (error) {
      toast.success('Title updated successfully')
    }
  }

  const deleteResume = async (resumeId) => {
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if (confirm) {
        const { data } = await api.delete(`/api/resumes/delete/${resumeId}`, { headers: { Authorization: token } })
        setAllResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success("Resume deleted successfully")  
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  useEffect(() => {
    loadAllResumes()
  }, [])

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
      <div className='max-w-7xl mx-auto px-6 py-10'>

        {/* Header */}
        <div className='mb-10'>
          <h1 className='text-3xl font-bold text-gray-800 dark:text-gray-100'>
            Welcome back, <span className='text-green-600'>{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>Manage your resumes and create new ones</p>
        </div>

        {/* Stats Bar */}
        <div className='grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10'>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm'>
            <p className='text-3xl font-bold text-green-600'>{allResumes.length}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Total Resumes</p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm'>
            <p className='text-3xl font-bold text-indigo-600'>{allResumes.filter(r => r.public).length}</p>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Public Resumes</p>
          </div>
          <div className='bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hidden sm:block'>
            <p className='text-3xl font-bold text-purple-600'>
              {allResumes.length > 0 ? new Date(Math.max(...allResumes.map(r => new Date(r.updatedAt)))).toLocaleDateString() : '-'}
            </p>
            <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Last Updated</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 mb-10'>
          <button onClick={() => setShowCreateResume(true)}
          className='flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95'>
            <PlusIcon className='size-5' />
            Create Resume
          </button>
          <button onClick={() => setShowUploadResume(true)}
          className='flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-gray-700 text-purple-600 border border-purple-200 dark:border-purple-800 rounded-xl font-medium transition-all shadow-sm hover:shadow-md active:scale-95'>
            <UploadCloudIcon className='size-5' />
            Upload PDF
          </button>
        </div>

        {/* Resume Grid */}
        {allResumes.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center'>
            <div className='size-20 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-4'>
              <FileText className='size-10 text-green-400' />
            </div>
            <h3 className='text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2'>No resumes yet</h3>
            <p className='text-gray-400 dark:text-gray-500 mb-6'>Create your first resume or upload an existing one</p>
            <button onClick={() => setShowCreateResume(true)}
            className='flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-all'>
              <PlusIcon className='size-5' /> Create Resume
            </button>
          </div>
        ) : (
          <div>
            <h2 className='text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4'>Your Resumes</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
              {allResumes.map((resume, index) => {
                const baseColor = colors[index % colors.length];
                return (
                  <div key={index}
                  className='group relative rounded-2xl border cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden'
                  style={{ background: `linear-gradient(135deg, ${baseColor}10, ${baseColor}30)`, borderColor: baseColor + '40' }}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}>

                    {/* Action Buttons */}
                    <div onClick={e => e.stopPropagation()}
className='absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
    <button onClick={() => { setEditResumeId(resume._id); setTitle(resume.title) }}
    className='p-1.5 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm transition-colors'>
        <PencilIcon className='size-3.5 text-gray-600 dark:text-gray-300' />
    </button>

    {/* 👈 Add this duplicate button */}
    <button onClick={() => duplicateResume(resume._id)}
    className='p-1.5 bg-white/90 dark:bg-gray-800/90 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg shadow-sm transition-colors'>
        <CopyIcon className='size-3.5 text-blue-500' />
    </button>

    <button onClick={() => deleteResume(resume._id)}
    className='p-1.5 bg-white/90 dark:bg-gray-800/90 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg shadow-sm transition-colors'>
        <TrashIcon className='size-3.5 text-red-500' />
    </button>
</div>

                    {/* Card Content */}
                    <div className='p-5 pt-8 pb-4 flex flex-col items-center text-center'>
                      <div className='size-14 rounded-2xl flex items-center justify-center mb-3'
                      style={{ background: `${baseColor}20` }}>
                        <FilePenLineIcon className='size-7' style={{ color: baseColor }} />
                      </div>
                      <p className='font-semibold text-sm px-1 leading-tight mb-1' style={{ color: baseColor }}>
                        {resume.title}
                      </p>
                      {resume.public && (
                        <span className='text-xs px-2 py-0.5 rounded-full text-white mt-1' style={{ backgroundColor: baseColor }}>
                          Public
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className='px-4 pb-3 text-center'>
                      <p className='text-[10px] text-gray-400 dark:text-gray-500'>
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Create Resume Modal */}
      {showCreateResume && (
        <Modal title='Create New Resume' onClose={() => { setShowCreateResume(false); setTitle('') }} onSubmit={createResume}>
          <input onChange={e => setTitle(e.target.value)} value={title} type="text"
          placeholder='e.g. Software Engineer Resume'
          className='w-full px-4 py-3 mb-6 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:border-green-500 text-gray-700' required />
          <button className='w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium'>
            Create Resume
          </button>
        </Modal>
      )}

      {/* Upload Resume Modal */}
      {showUploadResume && (
        <Modal title='Upload Resume' onClose={() => { setShowUploadResume(false); setTitle(''); setResume(null) }} onSubmit={uploadResume}>
          <input onChange={e => setTitle(e.target.value)} value={title} type="text"
          placeholder='e.g. My Uploaded Resume'
          className='w-full px-4 py-3 mb-4 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:border-green-500 text-gray-700' required />
          <label htmlFor="resume-input" className='block cursor-pointer'>
            <div className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 mb-6 transition-colors ${resume ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'}`}>
              {resume ? (
                <>
                  <div className='size-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center'>
                    <FileText className='size-6 text-green-600' />
                  </div>
                  <p className='text-green-700 dark:text-green-400 font-medium text-sm'>{resume.name}</p>
                  <p className='text-green-500 text-xs'>Click to change file</p>
                </>
              ) : (
                <>
                  <div className='size-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center'>
                    <UploadCloud className='size-6 text-purple-600' />
                  </div>
                  <p className='text-gray-600 dark:text-gray-300 font-medium text-sm'>Click to upload PDF</p>
                  <p className='text-gray-400 text-xs'>PDF files only</p>
                </>
              )}
            </div>
          </label>
          <input type="file" id='resume-input' accept='.pdf' hidden onChange={e => setResume(e.target.files[0])} />
          <button disabled={isLoading}
          className='w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-70'>
            {isLoading && <LoaderCircleIcon className='animate-spin size-4' />}
            {isLoading ? 'Processing with AI...' : 'Upload & Parse Resume'}
          </button>
        </Modal>
      )}

      {/* Edit Title Modal */}
      {editResumeId && (
        <Modal title='Rename Resume' onClose={() => { setEditResumeId(''); setTitle('') }} onSubmit={editTitle}>
          <input onChange={e => setTitle(e.target.value)} value={title} type="text"
          placeholder='Enter new title'
          className='w-full px-4 py-3 mb-6 border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 rounded-xl focus:outline-none focus:border-green-500 text-gray-700' required />
          <button className='w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium'>
            Update Title
          </button>
        </Modal>
      )}
    </div>
  )
}

export default Dashboard