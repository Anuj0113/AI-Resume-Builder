import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../app/features/authSlice'
import { LogOut, ChevronDown, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const Navbar = () => {
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const { darkMode, toggleDarkMode } = useTheme()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)

    const logoutUser = () => {
        localStorage.removeItem('token')
        dispatch(logout())
        window.location.replace('/')
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    return (
        <div className='bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-40 transition-colors'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-6 py-3 text-slate-800'>
                <Link to='/app'>
                    <img src="/logo.svg" alt="logo" className='h-10 w-auto dark:invert' />
                </Link>

                <div className='flex items-center gap-2'>
                    {/* Dark Mode Toggle */}
                    <button onClick={toggleDarkMode}
                    className='p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'>
                        {darkMode
                            ? <Sun className='size-5 text-yellow-400' />
                            : <Moon className='size-5 text-gray-500' />
                        }
                    </button>

                    {/* User Dropdown */}
                    <div className='relative' ref={dropdownRef}>
                        <button onClick={() => setDropdownOpen(!dropdownOpen)}
                        className='flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all'>
                            <div className='size-9 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold text-sm'>
                                {initials}
                            </div>
                            <div className='hidden sm:block text-left'>
                                <p className='text-sm font-medium text-gray-800 dark:text-gray-100'>{user?.name}</p>
                                <p className='text-xs text-gray-400'>{user?.email}</p>
                            </div>
                            <ChevronDown className={`size-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className='absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-50'>
                                <div className='px-4 py-3 border-b border-gray-100 dark:border-gray-700'>
                                    <p className='text-sm font-semibold text-gray-800 dark:text-gray-100'>{user?.name}</p>
                                    <p className='text-xs text-gray-400 truncate'>{user?.email}</p>
                                </div>
                                <div className='p-2'>
                                    <button onClick={logoutUser}
                                    className='w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors'>
                                        <LogOut className='size-4' />
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar