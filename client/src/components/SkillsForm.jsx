import React, { useState } from 'react'
import { Plus, Sparkles, X } from 'lucide-react'

const SkillsForm = ({ data, onChange }) => {

    const [newSkill, setNewSkill] = useState("")

    const addSkill = () => {
        if (newSkill.trim() && !data.includes(newSkill.trim())) {
            onChange([...data, newSkill.trim()])
            setNewSkill("")
        }
    }

    const removeSkill = (indexToRemove) => {
        onChange(data.filter((_, index) => index !== indexToRemove))
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            addSkill()
        }
    }

    return (
        <div className='space-y-4'>
            <div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Skills</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Add your technical and soft skills</p>
            </div>

            <div className='flex gap-2'>
                <input type="text" placeholder='Enter a skill (e.g., Javascript, Communication)'
                className='flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-green-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'
                onChange={(e) => setNewSkill(e.target.value)} value={newSkill} onKeyDown={handleKeyPress} />
                <button onClick={addSkill}
                className='flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={!newSkill.trim()}>
                    <Plus className='size-4' />
                </button>
            </div>

            {data.length > 0 ? (
                <div className='flex flex-wrap gap-2'>
                    {data.map((skill, index) => (
                        <span key={index} className='flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded-full text-sm'>
                            {skill}
                            <button onClick={() => removeSkill(index)}
                            className='ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors'>
                                <X className='w-3 h-3' />
                            </button>
                        </span>
                    ))}
                </div>
            ) : (
                <div className='text-center py-6 text-gray-500 dark:text-gray-400'>
                    <Sparkles className='w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600' />
                    <p>No skills added yet.</p>
                    <p className='text-sm'>Add your technical and soft skills above</p>
                </div>
            )}

            <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 p-3 rounded-xl'>
                <p className='text-sm text-blue-800 dark:text-blue-400'>
                    <strong>Tip:</strong> Add 8-12 relevant skills. Include both technical and soft skills.
                </p>
            </div>
        </div>
    )
}

export default SkillsForm