import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import bookmarkStroke from "../../assets/bookmark-stroke.svg"
import bookmark from '../../assets/bookmark.svg'

// Enhanced icons
const BookmarkIcon = ({ isActive }) => (
  <svg className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const PriceIcon = () => (
  <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
  </svg>
);

function Card(props) {
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
      const newData = [...existingData, { name: props.name, title: props.title, img: props.img, price: props.price, description: props.description, path: props.path }];
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
    <div className="group relative w-full h-[320px] bg-white dark:bg-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] overflow-hidden border border-slate-200/50 dark:border-gray-700/50">
      <div key={props.id} className="w-full h-full p-4 relative flex flex-col">
        <Link to={props.path} className="flex flex-col h-full">
          {/* Image Container */}
          <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-800 dark:to-gray-700">
            <img
              src={props.img}
              alt={props.title}
              className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-gray-300 transition-colors duration-300">
              {props.title}
            </h3>

            {/* Price */}
            <div className="mt-auto flex items-center gap-2">
              <PriceIcon />
              <p className='text-lg font-semibold text-emerald-600 dark:text-emerald-400'>
                {props.price}₮
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Enhanced Bookmark Button */}
      <button
        onClick={() => save()}
        className={`absolute top-4 right-4 w-10 h-10 rounded-full flex justify-center items-center shadow-lg transition-all duration-300 hover:scale-110 ${isBookmarked
          ? 'bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600'
          : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 border border-slate-200 dark:border-gray-600'
          }`}
      >
        <BookmarkIcon isActive={isBookmarked} />
      </button>

      {/* Shine effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute -top-1 -left-1 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </div>
  )
}

export default Card;
