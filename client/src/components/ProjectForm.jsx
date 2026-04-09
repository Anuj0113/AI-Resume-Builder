import React from 'react'
import { Plus, Trash2, Folder } from 'lucide-react'

const inputClass = 'w-full px-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500'

const ProjectForm = ({ data, onChange }) => {

    const addProject = () => {
        onChange([...data, { name: "", type: "", description: "" }])
    }

    const removeProject = (index) => {
        onChange(data.filter((_, i) => i !== index))
    }

    const updateProject = (index, field, value) => {
        const updated = [...data]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Projects</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>Add your projects here</p>
                </div>
                <button onClick={addProject}
                className='flex items-center gap-2 px-4 py-2 text-sm bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium'>
                    <Plus className='size-4' /> Add
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-2xl'>
                    <div className='size-14 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3'>
                        <Folder className='size-7 text-gray-400' />
                    </div>
                    <p className='font-medium text-gray-600 dark:text-gray-300'>No projects added yet</p>
                    <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>Click "Add" to add your projects</p>
                </div>
            ) : (
                <div className='space-y-4'>
                    {data.map((project, index) => (
                        <div key={index} className='border border-gray-200 dark:border-gray-600 rounded-2xl overflow-hidden'>
                            <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600'>
                                <div className='flex items-center gap-2'>
                                    <div className='size-7 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center'>
                                        <Folder className='size-3.5 text-orange-600' />
                                    </div>
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>
                                        {project.name || `Project #${index + 1}`}
                                    </span>
                                </div>
                                <button onClick={() => removeProject(index)}
                                className='p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors'>
                                    <Trash2 className='size-4' />
                                </button>
                            </div>

                            <div className='p-4 space-y-3 bg-white dark:bg-gray-800'>
                                <div>
                                    <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block'>Project Name</label>
                                    <input value={project.name || ""}
                                    onChange={(e) => updateProject(index, "name", e.target.value)}
                                    type="text" placeholder='e.g. E-commerce App'
                                    className={inputClass} />
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block'>Type / Tech Stack</label>
                                    <input value={project.type || ""}
                                    onChange={(e) => updateProject(index, "type", e.target.value)}
                                    type="text" placeholder='e.g. React, Node.js'
                                    className={inputClass} />
                                </div>
                                <div>
                                    <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block'>Description</label>
                                    <textarea rows={4} value={project.description || ""}
                                    onChange={(e) => updateProject(index, "description", e.target.value)}
                                    placeholder='Describe what you built and your role...'
                                    className='w-full px-3 py-2 text-sm rounded-xl resize-none border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500' />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ProjectForm