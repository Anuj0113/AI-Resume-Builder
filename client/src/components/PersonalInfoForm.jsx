import React from 'react'
import { BriefcaseBusiness, Globe, Linkedin, Mail, MapPin, Phone, User } from 'lucide-react'

const PersonalInfoForm = ({ data, onChange, removeBackground, setRemoveBackground }) => {

    const handleChange = (field, value) => {
        onChange({ ...data, [field]: value })
    }

    const fields = [
        { key: "full_name", label: "Full Name", icon: User, type: "text", required: true, placeholder: "e.g. John Smith" },
        { key: "email", label: "Email", icon: Mail, type: "email", required: true, placeholder: "e.g. john@gmail.com" },
        { key: "phone", label: "Phone Number", icon: Phone, type: "tel", placeholder: "e.g. +91 9876543210" },
        { key: "location", label: "Location", icon: MapPin, type: "text", placeholder: "e.g. Mumbai, India" },
        { key: "profession", label: "Profession", icon: BriefcaseBusiness, type: "text", placeholder: "e.g. Full Stack Developer" },
        { key: "linkedin", label: "LinkedIn Profile", icon: Linkedin, type: "url", placeholder: "e.g. linkedin.com/in/johnsmith" },
        { key: "website", label: "Personal Website", icon: Globe, type: "url", placeholder: "e.g. johnsmith.dev" },
    ]

    const inputClass = 'w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700'

    return (
        <div>
            {/* Header */}
            <div className='mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>Personal Information</h3>
                <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>This information will appear at the top of your resume</p>
            </div>

            {/* Profile Image Upload */}
            <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-200 mb-3'>Profile Photo</p>
                <div className='flex items-center gap-4'>
                    <label className='cursor-pointer'>
                        {data.image ? (
                            <div className='relative group'>
                                <img
                                src={typeof data.image === 'string' ? data.image : URL.createObjectURL(data.image)}
                                alt="profile"
                                className='w-16 h-16 rounded-full object-cover ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-800' />
                                <div className='absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                                    <p className='text-white text-[10px] text-center'>Change</p>
                                </div>
                            </div>
                        ) : (
                            <div className='w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-500 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center'>
                                <User className='size-6 text-gray-400 dark:text-gray-400' />
                            </div>
                        )}
                        <input type="file" accept="image/jpeg, image/png" hidden
                        onChange={(e) => handleChange("image", e.target.files[0])} />
                    </label>
                    <div>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                            {data.image ? 'Click photo to change' : 'Click to upload photo'}
                        </p>
                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>JPG or PNG, max 5MB</p>

                        {/* Remove Background Toggle */}
                        {typeof data.image === 'object' && (
                            <label className='flex items-center gap-2 mt-2 cursor-pointer'>
                                <div className='relative'>
                                    <input type="checkbox" className='sr-only peer'
                                    onChange={() => setRemoveBackground(prev => !prev)}
                                    checked={removeBackground} />
                                    <div className='w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-green-500 transition-colors'></div>
                                    <div className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4'></div>
                                </div>
                                <span className='text-xs text-gray-600 dark:text-gray-300'>Remove background</span>
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Fields */}
            <div className='space-y-4'>
                {fields.map((field) => {
                    const Icon = field.icon;
                    return (
                        <div key={field.key}>
                            <label className='flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'>
                                <Icon className='size-3.5 text-gray-400 dark:text-gray-500' />
                                {field.label}
                                {field.required && <span className='text-red-500'>*</span>}
                            </label>
                            <input
                            type={field.type}
                            value={data[field.key] || ""}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={inputClass} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default PersonalInfoForm