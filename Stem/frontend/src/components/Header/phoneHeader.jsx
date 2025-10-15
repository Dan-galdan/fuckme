import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth';
import { apiClient } from '../../api/client';
import sun from '../../assets/sun.svg'
import moon from '../../assets/moon.svg'
import logo from '../../assets/logo.png'

// Enhanced mobile icons
const SearchIcon = () => (
    <svg className="w-5 h-5 text-slate-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const BookmarkIcon = () => (
    <svg className="w-5 h-5 text-slate-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const ProfileIcon = () => (
    <svg className="w-4 h-4 text-slate-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const DropdownArrow = ({ isOpen }) => (
    <svg
        className={`w-3 h-3 ml-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

function PhoneHeader({ darkMode, toggleDarkMode }) {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await apiClient.logout();
            logout();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Still logout locally even if API call fails
            logout();
            navigate('/');
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-gray-700/50 shadow-lg sm:hidden">
            <div className="px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo Section */}
                    <Link to="/" className="group flex items-center gap-2 hover:scale-105 transition-transform duration-300">
                        <div className="relative">
                            <img src={logo} alt="Amjilt STEM" className="w-8 h-8 rounded-lg shadow-sm" />
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <span className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors duration-300">
                            Amjilt STEM
                        </span>
                    </Link>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Link to="/search" className="group p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800/20 transition-all duration-300 hover:scale-110">
                            <SearchIcon />
                        </Link>

                        <Link to="/favourite" className="group p-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-800/20 transition-all duration-300 hover:scale-110">
                            <BookmarkIcon />
                        </Link>

                        {/* Login/Signup Buttons or Profile Dropdown */}
                        {isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/20 transition-all duration-300"
                                >
                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
                                        <ProfileIcon />
                                    </div>
                                    <DropdownArrow isOpen={isProfileOpen} />
                                </button>

                                {/* Profile Dropdown */}
                                <div
                                    className={`absolute right-0 mt-2 w-40 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl backdrop-blur-xl z-20 overflow-hidden transition-all duration-300 ${isProfileOpen
                                            ? 'opacity-100 visible translate-y-0'
                                            : 'opacity-0 invisible -translate-y-2'
                                        }`}
                                >
                                    <div className="py-2">
                                        <div className="px-3 py-2 border-b border-slate-200 dark:border-gray-700">
                                            <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                                                {user?.name || 'Хэрэглэгч'}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-gray-400 truncate">
                                                {user?.email}
                                            </p>
                                        </div>

                                        <Link
                                            to="/dashboard"
                                            className="flex items-center px-3 py-2 text-xs text-slate-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-800/20 transition-colors duration-200"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                            </svg>
                                            Хяналтын самбар
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                        >
                                            <svg className="w-3 h-3 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Гарах
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <Link
                                    to="/login"
                                    className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                                >
                                    Нэвтрэх
                                </Link>
                                <Link
                                    to="/signup"
                                    className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors duration-300"
                                >
                                    Бүртгүүлэх
                                </Link>
                            </div>
                        )}

                        {/* Enhanced Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="relative w-12 h-6 flex items-center rounded-full p-1 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-gray-700 dark:to-gray-800 shadow-inner transition-all duration-300 hover:shadow-lg"
                        >
                            <div
                                className={`w-4 h-4 rounded-full absolute transform transition-all duration-300 flex items-center justify-center shadow-lg ${darkMode
                                        ? 'translate-x-5 bg-gradient-to-br from-gray-800 to-black'
                                        : 'translate-x-0 bg-gradient-to-br from-yellow-400 to-orange-400'
                                    }`}
                            >
                                <img
                                    src={darkMode ? moon : sun}
                                    alt={darkMode ? "moon" : "sun"}
                                    className="w-2.5 h-2.5"
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default PhoneHeader;
