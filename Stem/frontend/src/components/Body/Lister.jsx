import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bookmarkStroke from '/bookmarkStroke.svg'
import bookmark from '/bookmark.svg'

// Enhanced icons
const BookmarkIcon = ({ isActive }) => (
  <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

function Lister(props) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if the current experiment is already bookmarked
    const existingData = JSON.parse(localStorage.getItem(props.type)) || [];
    const isExisting = existingData.some(item => item.name === props.name);
    setIsBookmarked(isExisting);
  }, [props.name, props.type]);

  function save() {
    // Get existing data from localStorage for the specific type
    let existingData = JSON.parse(localStorage.getItem(props.type)) || [];
    
    // Check if the current item already exists in the array
    const isExisting = existingData.some(item => item.name === props.name);

    if (!isExisting) {
      // Add new item to the existing data array
      const newData = [...existingData, { name: props.name,title: props.title, description: props.description, path: props.path }];
      localStorage.setItem(props.type, JSON.stringify(newData));
      console.log(`Added to bookmarks in ${props.type}`);
      setIsBookmarked(true); // Update bookmark status
    } else {
      // Remove the item from bookmarks
      const newData = existingData.filter(item => item.name !== props.name);
      localStorage.setItem(props.type, JSON.stringify(newData));
      console.log(`Removed from bookmarks in ${props.type}`);
      setIsBookmarked(false); // Update bookmark status
    }
  }

  return (
    <div className="w-full relative text-slate-900 dark:text-white">
      <div key={props.id} className="group relative bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>
        
        <div className="relative z-10 pr-16">
          <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors duration-300">
            {props.title}
          </h3>
          <p className="text-slate-600 dark:text-gray-300 mb-4 leading-relaxed">
            {props.description}
          </p>
          <Link
            to={props.path}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 group-hover:underline"
          >
            Цааш үзэх
            <ArrowIcon />
          </Link>
        </div>
        
        {/* Enhanced Bookmark Button */}
        <button 
          onClick={() => save()} 
          className={`absolute top-4 right-4 w-12 h-12 rounded-full flex justify-center items-center shadow-lg transition-all duration-300 hover:scale-110 ${
            isBookmarked 
              ? 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600' 
              : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-600'
          }`}
        >
          <BookmarkIcon isActive={isBookmarked} />
        </button>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Shine effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  )
}

export default Lister;
