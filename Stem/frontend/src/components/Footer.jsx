import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import logo from '/logo.png'  bro remember to do this later

// Enhanced social media icons
const FacebookIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const InstagramIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323z" />
    </svg>
);

const YouTubeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);

const CopyrightIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
);

function Footer() {
    return (
        <footer className="w-full bg-gradient-to-b from-white to-slate-50 dark:from-gray-900 dark:to-black border-t border-slate-200 dark:border-gray-700 hidden sm:block">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Logo and Brand */}
                        <div className="md:col-span-1">
                            <Link to="/" className="group flex items-center gap-3 mb-6">
                                <div className="relative">
                                    <img src={logo} alt="Amjilt STEM" className="w-12 h-12 rounded-xl shadow-sm" />
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                                        Amjilt STEM
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-gray-400">
                                        ЭЕШ-ийн бүх материал нэг дор
                                    </p>
                                </div>
                            </Link>
                            <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed">
                                ЭЕШ, олимпиад, STEM туршилтын контентуудыг нэг дороос — сурагч бүрт хүртээмжтэйгээр.
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <div className="md:col-span-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Холбоосууд</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link
                                        to="/aboutUs"
                                        className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                        Бидний тухай
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/surtchilgaa"
                                        className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                        Сурталчилгаа байршуулах
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/holboobarih"
                                        className="text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                                        Холбоо барих
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Social Media */}
                        <div className="md:col-span-1">
                            <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Сошиал медиа</h4>
                            <div className="flex gap-4">
                                <a
                                    href="#"
                                    className="p-3 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-slate-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
                                >
                                    <FacebookIcon />
                                </a>
                                <a
                                    href="#"
                                    className="p-3 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-pink-50 dark:hover:bg-pink-900/20 text-slate-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-300 hover:scale-110"
                                >
                                    <InstagramIcon />
                                </a>
                                <a
                                    href="#"
                                    className="p-3 rounded-xl bg-slate-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 hover:scale-110"
                                >
                                    <YouTubeIcon />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-slate-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                            <CopyrightIcon />
                            <span>2025 Amjilt STEM</span>
                            <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                            <span>Бүх эрх хуулиар хамгаалагдсан</span>
                        </div>
                        <div className="text-sm text-slate-500 dark:text-gray-400">
                            Made with ❤️ for Mongolian students
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer