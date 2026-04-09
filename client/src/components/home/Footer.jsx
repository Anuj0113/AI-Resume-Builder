import React from 'react'

const Footer = () => {
  return (
    <>
        <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');
            * { font-family: 'Poppins', sans-serif; }
        `}</style>
        
        <footer className="flex flex-wrap justify-center lg:justify-between overflow-hidden gap-10 md:gap-20 py-16 px-6 md:px-16 lg:px-24 xl:px-32 text-[13px] text-gray-500 dark:text-gray-400 bg-gradient-to-r from-white via-green-200/60 to-white dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900 mt-30 transition-colors">
            <div className="flex flex-wrap items-start gap-10 md:gap-15 xl:gap-35">
                <a href="#">
                    <img src="/logo.svg" alt="resume logo" className='h-11 w-auto dark:invert' />
                </a>
                <div>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">Product</p>
                    <ul className="mt-2 space-y-2">
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Home</a></li>
                        <li><a href="#features" className="hover:text-green-600 dark:hover:text-green-400 transition">Features</a></li>
                        <li><a href="#testimonials" className="hover:text-green-600 dark:hover:text-green-400 transition">Testimonials</a></li>
                        <li><a href="/login?state=register" className="hover:text-green-600 dark:hover:text-green-400 transition">Get Started</a></li>
                    </ul>
                </div>
                <div>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">Resources</p>
                    <ul className="mt-2 space-y-2">
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Resume Tips</a></li>
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Career Blog</a></li>
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">ATS Guide</a></li>
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Interview Prep</a></li>
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">Legal</p>
                    <ul className="mt-2 space-y-2">
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Privacy Policy</a></li>
                        <li><a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            <div className="flex flex-col max-md:items-center max-md:text-center gap-2 items-end">
                <p className="max-w-60 dark:text-gray-400">Helping job seekers land their dream jobs with AI-powered resumes.</p>
                <div className="flex items-center gap-4 mt-3">
                    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin size-5 hover:text-green-500">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect width="4" height="12" x="2" y="9"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                    <a href="https://x.com/" target="_blank" rel="noreferrer" className="dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter size-5 hover:text-green-500">
                            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube size-6 hover:text-green-500">
                            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
                            <path d="m10 15 5-3-5-3z"></path>
                        </svg>
                    </a>
                    <a href="https://github.com/Anuj0113" target="_blank" rel="noreferrer" className="dark:text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5 hover:text-green-500">
                            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                            <path d="M9 18c-4.51 2-5-2-7-2"></path>
                        </svg>
                    </a>
                </div>
                <p className="mt-3 text-center dark:text-gray-400">© 2025 <a href="/" className="hover:text-green-600 dark:hover:text-green-400 transition">resume.</a> All rights reserved.</p>
            </div>
        </footer>
    </>
  )
}

export default Footer