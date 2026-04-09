import React from 'react'
import { Briefcase, Plus, Sparkles, Trash2, Building2, Calendar, Loader2 } from 'lucide-react'
import api from '../configs/api'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const inputClass = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'

const ExperienceForm = ({ data, onChange }) => {
    const { token } = useSelector(state => state.auth)
    const [generatingIndex, setGeneratingIndex] = React.useState(-1)

    const addExperience = () => {
        onChange([...data, {
            company: "", position: "", start_date: "",
            end_date: "", description: "", is_current: false
        }])
    }

    const removeExperience = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }

    const updateExperience = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const generateDescription = async (index) => {
        setGeneratingIndex(index)
        const experience = data[index]
        const prompt = `enhance this job description ${experience.description} for the position of ${experience.position} at ${experience.company}`
        try {
            const { data } = await api.post('/api/ai/enhanced-job-desc', { userContent : prompt }, { headers: { Authorization: token } })
            updateExperience(index, "description", data.enhancedContent)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enhance job description')
        }finally{
            setGeneratingIndex(-1)
        }
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Professional Experience</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>Add your work history starting from most recent</p>
                </div>
                <button onClick={addExperience}
                className='flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium'>
                    <Plus className='size-4' /> Add
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl'>
                    <div className='size-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <Briefcase className='size-7 text-gray-400' />
                    </div>
                    <p className='font-medium text-gray-600 dark:text-gray-300'>No experience added yet</p>
                    <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>Click "Add" to add your work history</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((experience, index) => (
                        <div key={index} className='border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden'>
                            <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <div className='size-7 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center'>
                                        <Briefcase className='size-3.5 text-green-600' />
                                    </div>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                                        {experience.position || experience.company || `Experience #${index + 1}`}
                                    </span>
                                </div>
                                <button onClick={() => removeExperience(index)}
                                className='p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>

                            <div className='p-4 space-y-3 bg-white dark:bg-gray-800'>
                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                            <Building2 className='size-3' /> Company
                                        </label>
                                        <input type="text" placeholder='e.g. Google'
                                        className={inputClass}
                                        value={experience.company || ""}
                                        onChange={(e) => updateExperience(index, "company", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                            <Briefcase className='size-3' /> Job Title
                                        </label>
                                        <input type="text" placeholder='e.g. Software Engineer'
                                        className={inputClass}
                                        value={experience.position || ""}
                                        onChange={(e) => updateExperience(index, "position", e.target.value)} />
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                            <Calendar className='size-3' /> Start Date
                                        </label>
                                        <input type="month"
                                        className={inputClass}
                                        value={experience.start_date || ""}
                                        onChange={(e) => updateExperience(index, "start_date", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                            <Calendar className='size-3' /> End Date
                                        </label>
                                        <input type="month"
                                        className={`${inputClass} disabled:bg-gray-50 dark:disabled:bg-gray-600 disabled:text-gray-400`}
                                        value={experience.end_date || ""}
                                        onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                                        disabled={experience.is_current} />
                                    </div>
                                </div>

                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <div className='relative'>
                                        <input type="checkbox"
                                        checked={experience.is_current || false}
                                        onChange={(e) => updateExperience(index, "is_current", e.target.checked)}
                                        className='sr-only peer' />
                                        <div className='w-9 h-5 bg-gray-200 dark:bg-gray-600 rounded-full peer-checked:bg-green-500 transition-colors'></div>
                                        <div className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></div>
                                    </div>
                                    <span className='text-sm text-gray-600 dark:text-gray-300'>Currently working here</span>
                                </label>

                                <div>
                                    <div className='flex items-center justify-between mb-1'>
                                        <label className='text-xs font-medium text-gray-500 dark:text-gray-400'>Job Description</label>
                                        <button onClick={() => generateDescription(index)} disabled={generatingIndex === index || !experience.position || !experience.company}
                                        className='flex items-center gap-1 px-2.5 py-1 text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors font-medium'>
                                            {generatingIndex === index ? (
                                                <Loader2 className='w-3 h-3 animate-spin' />
                                            ) : (
                                                <Sparkles className='size-3' /> 
                                            )}
                                            Enhance with AI
                                        </button>
                                    </div>
                                    <textarea rows={4}
                                    value={experience.description || ""}
                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                    className='w-full text-sm px-3 py-2.5 rounded-xl resize-none border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'
                                    placeholder='Describe your key responsibilities and achievements...' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ExperienceForm