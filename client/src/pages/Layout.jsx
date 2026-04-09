import React, { useEffect } from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'

const Layout = () => {
  const { user, loading } = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true })
    }
  }, [user, loading])

  useEffect(() => {
    const handlePopState = () => {
      if (!user) {
        navigate('/login', { replace: true })
      }
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [user])

  if (loading) return <Loader />
  if (!user) return <Navigate to='/login' replace />

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout