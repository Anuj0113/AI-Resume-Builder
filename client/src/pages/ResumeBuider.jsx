import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOffIcon, FileText, Folder, GraduationCap, Share2Icon, Sparkles, User, Save, LoaderCircle } from 'lucide-react'
import PersonalInfoForm from '../components/PersonalInfoForm'
import ResumePreview from '../components/ResumePreview'
import TemplateSelector from '../components/TemplateSelector'
import ColorPicker from '../components/ColorPicker'
import ProfressionalSummaryForm from '../components/ProfessionalSummaryForm'
import ExperienceForm from '../components/ExperienceForm'
import EducationForm from '../components/EducationForm'
import ProjectForm from '../components/ProjectForm'
import SkillsForm from '../components/SkillsForm'
import ResumeScore from '../components/ResumeScore'
import { useSelector } from 'react-redux'
import api from '../configs/api'
import { toast } from 'react-hot-toast'

const ResumeBuider = () => {

  const { resumeId } = useParams()
  const { token } = useSelector(state => state.auth)
  const [isSaving, setIsSaving] = useState(false)
  const [activeView, setActiveView] = useState('form')

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    projects: [],
    skills: [],
    template: "classic",
    accent_color: '#3882F6',
    public: false,
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/get/' + resumeId, { headers: { Authorization: token } })
      if (data?.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0)
  const [removeBackground, setRemoveBackground] = useState(false)

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: Folder },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex]

  useEffect(() => {
    loadExistingResume()
  }, [])

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify({ public: !resumeData.public }))
      const {data} = await api.put(`/api/resumes/update/${resumeId}`, formData, {headers: {Authorization: token}})
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message)
    } catch (error) {
      toast.error('Failed to update visibility')
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeId
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" })
    } else {
      navigator.clipboard.writeText(resumeUrl)
      toast.success('Link copied to clipboard!')
    }
  }

  const downloadResume = () => {
    const printContents = document.getElementById('resume-preview').innerHTML
    const iframe = document.createElement('iframe')
    iframe.style.position = 'fixed'
    iframe.style.right = '0'
    iframe.style.bottom = '0'
    iframe.style.width = '0'
    iframe.style.height = '0'
    iframe.style.border = '0'
    document.body.appendChild(iframe)

    const doc = iframe.contentWindow.document
    doc.open()
    doc.write(`
        <html>
        <head>
            <style>
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; margin: 0; padding: 0; box-sizing: border-box; }
                @page { size: letter; margin: 0; }
            </style>
            ${Array.from(document.styleSheets).map(sheet => {
                try {
                    return `<style>${Array.from(sheet.cssRules).map(rule => rule.cssText).join('')}</style>`
                } catch(e) { return '' }
            }).join('')}
        </head>
        <body>${printContents}</body>
        </html>
    `)
    doc.close()

    iframe.contentWindow.focus()
    iframe.contentWindow.print()

    setTimeout(() => {
        document.body.removeChild(iframe)
    }, 1000)
}

  const saveResume = async () => {
    setIsSaving(true)
    try {
      let updatedResumeData = structuredClone(resumeData)
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image
      }
      const formData = new FormData()
      formData.append('resumeId', resumeId)
      formData.append('resumeData', JSON.stringify(updatedResumeData))
      removeBackground && formData.append('removeBackground', 'yes')
      typeof resumeData.personal_info.image === 'object' && formData.append('image', resumeData.personal_info.image)
      const {data} = await api.put(`/api/resumes/update/${resumeId}`, formData, {headers: {Authorization: token}})
      setResumeData(data.resume)
      toast.success('Resume saved successfully!')
    } catch (error) {
      toast.error('Failed to save resume')
    }
    setIsSaving(false)
  }

  const progressPercent = (activeSectionIndex / (sections.length - 1)) * 100

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>

      {/* Top Bar */}
      <div className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30 transition-colors'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Link to='/app' className='flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors text-sm'>
              <ArrowLeftIcon className='size-4' />
              <span className='hidden sm:block'>Dashboard</span>
            </Link>
            <div className='h-5 w-px bg-gray-200 dark:bg-gray-600' />
            <h1 className='text-sm font-semibold text-gray-800 dark:text-gray-100 truncate max-w-40'>
              {resumeData.title || 'Untitled Resume'}
            </h1>
          </div>

          {/* Mobile View Toggle */}
          <div className='flex lg:hidden bg-gray-100 dark:bg-gray-700 rounded-lg p-1'>
            <button onClick={() => setActiveView('form')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${activeView === 'form' ? 'bg-white dark:bg-gray-600 shadow text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Edit
            </button>
            <button onClick={() => setActiveView('preview')}
            className={`px-3 py-1 text-xs rounded-md transition-all ${activeView === 'preview' ? 'bg-white dark:bg-gray-600 shadow text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Preview
            </button>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2'>
            <ResumeScore resumeData={resumeData} />

            {resumeData.public && (
              <button onClick={handleShare}
              className='flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'>
                <Share2Icon className='size-3.5' /> Share
              </button>
            )}

            <button onClick={changeResumeVisibility}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors'>
              {resumeData.public ? <EyeIcon className='size-3.5' /> : <EyeOffIcon className='size-3.5' />}
              {resumeData.public ? 'Public' : 'Private'}
            </button>

            <button onClick={downloadResume}
            className='flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'>
              <DownloadIcon className='size-3.5' /> Download
            </button>

            <button onClick={saveResume} disabled={isSaving}
            className='flex items-center gap-1.5 px-4 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70 font-medium'>
              {isSaving ? <LoaderCircle className='size-3.5 animate-spin' /> : <Save className='size-3.5' />}
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <div className='grid lg:grid-cols-12 gap-6'>

          {/* Left Panel */}
          <div className={`lg:col-span-5 ${activeView === 'preview' ? 'hidden lg:block' : ''}`}>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors'>

              {/* Progress Bar */}
              <div className='h-1 bg-gray-100 dark:bg-gray-700'>
                <div className='h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500'
                style={{ width: `${progressPercent}%` }} />
              </div>

              {/* Section Tabs */}
              <div className='border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'>
    <div className='flex items-center gap-2 px-4 pt-3 pb-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent'>
        {sections.map((section, index) => {
            const Icon = section.icon
            return (
                <button key={section.id}
                onClick={() => setActiveSectionIndex(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeSectionIndex === index ? 'bg-green-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                    <Icon className='size-4' />
                    {section.name}
                </button>
            )
        })}
    </div>
</div>

              {/* Tools Row */}
              <div className='flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800'>
                <div className='flex items-center gap-2'>
                  <TemplateSelector selectedTemplate={resumeData.template}
                  onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker selectedColor={resumeData.accent_color}
                  onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
                </div>
                <p className='text-xs text-gray-400 dark:text-gray-500'>
                  Step {activeSectionIndex + 1} of {sections.length}
                </p>
              </div>

              {/* Form Content */}
              <div className='p-6 bg-white dark:bg-gray-800'>
                {activeSection.id === 'personal' && (
                  <PersonalInfoForm data={resumeData.personal_info}
                  onChange={(data) => setResumeData(prev => ({ ...prev, personal_info: data }))}
                  removeBackground={removeBackground} setRemoveBackground={setRemoveBackground} />
                )}
                {activeSection.id === "summary" && (
                  <ProfressionalSummaryForm data={resumeData.professional_summary}
                  onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))}
                  setResumeData={setResumeData} />
                )}
                {activeSection.id === "experience" && (
                  <ExperienceForm data={resumeData.experience}
                  onChange={(data) => setResumeData(prev => ({ ...prev, experience: data }))} />
                )}
                {activeSection.id === "education" && (
                  <EducationForm data={resumeData.education}
                  onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                )}
                {activeSection.id === "projects" && (
                  <ProjectForm data={resumeData.projects || []}
                  onChange={(data) => setResumeData(prev => ({ ...prev, projects: data }))} />
                )}
                {activeSection.id === "skills" && (
                  <SkillsForm data={resumeData.skills}
                  onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                )}

                {/* Navigation */}
                <div className='flex items-center justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-700'>
                  <button onClick={() => setActiveSectionIndex(prev => Math.max(prev - 1, 0))}
                  disabled={activeSectionIndex === 0}
                  className='flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed'>
                    <ChevronLeft className='size-4' /> Previous
                  </button>

                  <span className='text-xs text-gray-400 dark:text-gray-500'>
                    {activeSectionIndex + 1} / {sections.length}
                  </span>

                  <button onClick={() => setActiveSectionIndex(prev => Math.min(prev + 1, sections.length - 1))}
                  disabled={activeSectionIndex === sections.length - 1}
                  className='flex items-center gap-1.5 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed'>
                    Next <ChevronRight className='size-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className={`lg:col-span-7 ${activeView === 'form' ? 'hidden lg:block' : ''}`}>
            <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors'>
              <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex items-center justify-between'>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-400'>LIVE PREVIEW</p>
                <div className='flex items-center gap-1.5'>
                  <div className='size-2 rounded-full bg-green-500 animate-pulse' />
                  <p className='text-xs text-gray-400 dark:text-gray-500'>Auto-updating</p>
                </div>
              </div>
              <div className='overflow-auto max-h-[80vh]'>
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ResumeBuider