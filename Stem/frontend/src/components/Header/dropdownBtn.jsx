import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// Enhanced dropdown arrow icon
const DropdownArrow = ({ isOpen }) => (
  <svg 
    className={`w-4 h-4 ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

function DropdownBtn(props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    function handleClick() {
        setIsOpen(!isOpen);
    }

    return (
        <div className="relative z-10" ref={dropdownRef}>
            <button 
                onClick={handleClick} 
                className="group relative flex items-center px-3 py-2 font-semibold text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-gray-200 transition-all duration-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800/20"
            >
                <span>{props.Btn}</span>
                <DropdownArrow isOpen={isOpen} />
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 group-hover:w-full transition-all duration-300"></div>
            </button>
            
            {/* Enhanced Dropdown Menu */}
            <div 
                className={`absolute left-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-2xl shadow-xl backdrop-blur-xl z-20 overflow-hidden transition-all duration-300 ${
                    isOpen 
                        ? 'opacity-100 visible translate-y-0' 
                        : 'opacity-0 invisible -translate-y-2'
                }`}
            >
                <div className="py-2">
                    {props.categories.map((e, index) => (
                        <Link 
                            to={e.link} 
                            key={e.id} 
                            onClick={() => setIsOpen(false)}
                            className="group block"
                        >
                            <div className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800/20 transition-all duration-200 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 opacity-60 group-hover:opacity-100 transition-opacity duration-200"></div>
                                <span>{e.category}</span>
                                <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </Link>
                    ))}
                </div>
                
                {/* Bottom accent */}
                <div className="h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
            </div>
        </div>
    );
}

export default DropdownBtn;
