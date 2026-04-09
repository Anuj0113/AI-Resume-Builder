import React, { useState } from 'react'
import { Lock } from 'lucide-react'
import api from '../configs/api'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const navigate = useNavigate()

    const token = new URLSearchParams(window.location.search).get('token')

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match')
        }
        try {
            const { data } = await api.post('/api/users/reset-password', { token, newPassword })
            toast.success(data.message)
            navigate('/login')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 px-4'>
            <div className='w-full max-w-md'>
                <form onSubmit={handleSubmit} className="text-center border border-gray-300/60 rounded-2xl px-8 py-2 bg-white shadow-sm">
                    <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>
                    <p className="text-gray-500 text-sm mt-2">Enter your new password below</p>

                    <div className="flex items-center mt-6 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <Lock size={13} color='#687280' />
                        <input type="password" placeholder='New Password'
                        className="border-none outline-none ring-0 w-full"
                        value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>

                    <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        <Lock size={13} color='#687280' />
                        <input type="password" placeholder='Confirm Password'
                        className="border-none outline-none ring-0 w-full"
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="mt-6 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity mb-10">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ResetPassword