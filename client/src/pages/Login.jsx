import React, { useEffect, useState } from 'react'
import {Lock, Mail, User2Icon} from 'lucide-react'
import api from '../configs/api'
import { useDispatch , useSelector } from 'react-redux'
import { login } from '../app/features/authSlice'
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
    const [state, setState] = React.useState(urlState || "login")
    const [showForgotPassword, setShowForgotPassword] = useState(false)
    const [fpEmail, setFpEmail] = useState('')
    const { user } = useSelector(state => state.auth)

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        password: ''
    })

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:3000/api/users/google'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const {data} = await api.post(`/api/users/${state}`, formData);
            dispatch(login(data))
            localStorage.setItem('token', data.token)
            toast.success(data.message)
            navigate('/app')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        if(user) {
            navigate('/app', { replace: true })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        try {
            const { data } = await api.post('/api/users/forgot-password', { email: fpEmail })
            toast.success(data.message)
            setShowForgotPassword(false)
            setFpEmail('')
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message)
        }
    }

    useEffect(() => {
        const query = new URLSearchParams(window.location.search)
        const token = query.get('token')
        if (token) {
            localStorage.setItem('token', token)
            api.get('/api/users/data', { headers: { Authorization: token } })
                .then(({ data }) => {
                    dispatch(login({ token, user: data.user }))
                    navigate('/app')
                })
        }
    }, [])

    const inputClass = "border-none outline-none ring-0 w-full bg-transparent dark:bg-transparent text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 [&:-webkit-autofill]:shadow-[0_0_0px_1000px_rgb(55,65,81)_inset] [&:-webkit-autofill]:[color-scheme:dark]"
    const wrapperClass = "flex items-center w-full bg-white dark:bg-gray-700 border border-gray-300/80 dark:border-gray-600 h-12 rounded-full overflow-hidden pl-6 gap-2"

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-200'>
            <div className='w-full max-w-md'>
                <form onSubmit={handleSubmit} className="text-center border border-gray-300/60 dark:border-gray-700 rounded-2xl px-8 py-2 bg-white dark:bg-gray-800 shadow-sm">

                    <h1 className="text-gray-900 dark:text-gray-100 text-3xl mt-10 font-medium">
                        {state === "login" ? "Login" : "Sign up"}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                        Please {state} to continue
                    </p>

                    {/* Name - only for signup */}
                    {state !== "login" && (
                        <div className={`${wrapperClass} mt-6`}>
                            <User2Icon size={16} color='#687280' />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                className={inputClass}
                                value={formData.name}
                                onChange={handleChange}
                                required />
                        </div>
                    )}

                    {/* Email */}
                    <div className={`${wrapperClass} mt-4`}>
                        <Mail size={13} color='#687280' />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email id"
                            className={inputClass}
                            value={formData.email}
                            onChange={handleChange}
                            required />
                    </div>

                    {/* Password */}
                    <div className={`${wrapperClass} mt-4`}>
                        <Lock size={13} color='#687280' />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            className={inputClass}
                            value={formData.password}
                            onChange={handleChange}
                            required />
                    </div>

                    {/* Forgot Password */}
                    <div className="mt-4 text-left text-green-500">
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm hover:underline">
                            Forgot password?
                        </button>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity">
                        {state === "login" ? "Login" : "Sign up"}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                        <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                        <span className="text-gray-400 dark:text-gray-500 text-sm">or</span>
                        <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full h-11 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Continue with Google</span>
                    </button>

                    {/* Toggle Login/Register */}
                    <p
                        onClick={() => setState(prev => prev === "login" ? "register" : "login")}
                        className="text-gray-500 dark:text-gray-400 text-sm mt-3 mb-11 cursor-pointer">
                        {state === "login" ? "Don't have an account?" : "Already have an account?"}
                        <span className="text-green-500 hover:underline ml-1">click here</span>
                    </p>

                </form>
            </div>

            {/* Forgot Password Popup */}
            {showForgotPassword && (
                <div
                    onClick={() => setShowForgotPassword(false)}
                    className='fixed inset-0 bg-black/50 z-10 flex items-center justify-center px-4'>
                    <form
                        onClick={e => e.stopPropagation()}
                        onSubmit={handleForgotPassword}
                        className='bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-sm shadow-lg border border-gray-200 dark:border-gray-700'>
                        <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2'>
                            Forgot Password
                        </h2>
                        <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
                            Enter your email and we'll send you a reset link
                        </p>
                        <div className={`${wrapperClass} mb-4`}>
                            <Mail size={13} color='#687280' />
                            <input
                                type="email"
                                placeholder='Enter your email'
                                className={inputClass}
                                value={fpEmail}
                                onChange={(e) => setFpEmail(e.target.value)}
                                required />
                        </div>
                        <button
                            type='submit'
                            className='w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity'>
                            Send Reset Link
                        </button>
                        <button
                            type='button'
                            onClick={() => setShowForgotPassword(false)}
                            className='w-full h-11 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition mt-2 text-sm text-gray-600 dark:text-gray-300'>
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default Login