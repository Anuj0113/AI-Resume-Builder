import React from 'react'
import { GraduationCap, Plus, Trash2, BookOpen, Calendar, Award } from 'lucide-react'

const inputClass = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'

const EducationForm = ({ data, onChange }) => {

    const addEducation = () => {
        onChange([...data, {
            institute: "", degree: "", field: "", graduation_date: "", gpa: ""
        }])
    }

    const removeEducation = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Education</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-0.5'>Add your academic qualifications</p>
                </div>
                <button onClick={addEducation}
                className='flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium'>
                    <Plus className='size-4' /> Add
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl'>
                    <div className='size-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <GraduationCap className='size-7 text-gray-400' />
                    </div>
                    <p className='font-medium text-gray-600 dark:text-gray-300'>No education added yet</p>
                    <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>Click "Add" to add your qualifications</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((education, index) => (
                        <div key={index} className='border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden'>
                            <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <div className='size-7 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center'>
                                        <GraduationCap className='size-3.5 text-blue-600' />
                                    </div>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                                        {education.institute || education.degree || `Education #${index + 1}`}
                                    </span>
                                </div>
                                <button onClick={() => removeEducation(index)}
                                className='p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>

                            <div className='p-4 space-y-3 bg-white dark:bg-gray-800'>
                                <div>
                                    <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                        <BookOpen className='size-3' /> Institute Name
                                    </label>
                                    <input type="text" placeholder='e.g. MIT, Stanford University'
                                    className={inputClass}
                                    value={education.institute || ""}
                                    onChange={(e) => updateEducation(index, "institute", e.target.value)} />
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block'>Degree</label>
                                        <input type="text" placeholder='e.g. Bachelors'
                                        className={inputClass}
                                        value={education.degree || ""}
                                        onChange={(e) => updateEducation(index, "degree", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block'>Field of Study</label>
                                        <input type="text" placeholder='e.g. Computer Science'
                                        className={inputClass}
                                        value={education.field || ""}
                                        onChange={(e) => updateEducation(index, "field", e.target.value)} />
                                    </div>
                                </div>

                                <div className='grid grid-cols-2 gap-3'>
                                    <div>
                                        <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                            <Calendar className='size-3' /> Graduation Date
                                        </label>
                                        <input type="month"
                                        className={inputClass}
                                        value={education.graduation_date || ""}
                                        onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className='flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>
                                            <Award className='size-3' /> GPA (optional)
                                        </label>
                                        <input type="text" placeholder='e.g. 3.8/4.0'
                                        className={inputClass}
                                        value={education.gpa || ""}
                                        onChange={(e) => updateEducation(index, "gpa", e.target.value)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm