import React, { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from "./pages/Home";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuider";
import Preview from "./pages/Preview";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import api from './configs/api';
import { useDispatch, useSelector } from 'react-redux';
import { login, setLoading } from './app/features/authSlice';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector(state => state.auth)

  useEffect(() => {
    const getUserData = async () => {
      const token = localStorage.getItem('token')
      if(token){
        try {
          const {data} = await api.get('/api/users/data', {headers: {Authorization: token}})
          if(data.user){
            dispatch(login({token, user: data.user}))
          } else {
            localStorage.removeItem('token')
          }
        } catch (error) {
          localStorage.removeItem('token')
        }
      }
      dispatch(setLoading(false))
    }
    getUserData()
  }, [])

  if(loading) return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='flex flex-col items-center gap-3'>
        <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-green-500'></div>

        <p className='text-gray-400 text-sm'>Loading...</p>
      </div>
    </div>
  )

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        success: { style: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }},
        error: { style: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }},
      }} />
      <Routes>
        {/* Public home - but redirect to /app if logged in */}
        <Route path='/' element={user ? <Navigate to='/app' replace /> : <Home />} />

        {/* Auth routes - redirect to /app if already logged in */}
        <Route path='/login' element={user ? <Navigate to='/app' replace /> : <Login />} />
        <Route path='/reset-password' element={user ? <Navigate to='/app' replace /> : <ResetPassword />} />

        {/* Protected routes - redirect to /login if not logged in */}
        <Route path='app' element={user ? <Layout /> : <Navigate to='/login' replace />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>

        <Route path='view/:resumeId' element={<Preview />} />

        {/* Catch all */}
        <Route path='*' element={<Navigate to={user ? '/app' : '/'} replace />} />
      </Routes>
    </>
  )
}

export default App