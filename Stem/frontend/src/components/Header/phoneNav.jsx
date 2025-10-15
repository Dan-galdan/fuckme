import { useState } from 'react';
import home from '../../assets/home.svg';
import physic from '../../assets/physic.svg';
import chemistry from '../../assets/chemistry.svg';
import market from '../../assets/market.svg';
import homeActive from '../../assets/homeActive.svg';
import physicActive from '../../assets/physicActive.svg';
import chemistryActive from '../../assets/chemistryActive.svg';
import marketActive from '../../assets/marketActive.svg';
import search from '../../assets/search.svg';
import searchActive from '../../assets/searchActive.svg'
import { Link, useLocation } from 'react-router-dom';

// Enhanced icons for better visual consistency
const HomeIcon = ({ isActive }) => (
  <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = ({ isActive }) => (
  <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PhysicIcon = ({ isActive }) => (
  <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="2" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="10" ry="4.5" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(60 12 12)" strokeWidth="1.5" />
    <ellipse cx="12" cy="12" rx="4.5" ry="10" transform="rotate(-60 12 12)" strokeWidth="1.5" />
  </svg>
);

const ChemistryIcon = ({ isActive }) => (
  <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" />
  </svg>
);

const MarketIcon = ({ isActive }) => (
  <svg className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-600 dark:text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);
function NavBar() {
  const location = useLocation();
  const tabs = [
    { name: "Home", icon: home, activeIcon: homeActive, component: HomeIcon },
    { name: "Search", icon: search, activeIcon: searchActive, component: SearchIcon },
    { name: "Physic", icon: physic, activeIcon: physicActive, component: PhysicIcon },
    { name: "Chemistry", icon: chemistry, activeIcon: chemistryActive, component: ChemistryIcon },
    { name: "Market", icon: market, activeIcon: marketActive, component: MarketIcon },
  ];

  const activeIndex = tabs.findIndex(tab => {
    const currentPath = location.pathname.slice(1).split('/')[0] || 'home';
    return tab.name.toLowerCase() === currentPath;
  });

  const getTranslateValue = (index) => {
    return `translateX(${index * 80}px)`; // 96px = 6rem = w-24
  };

  return (
    <div className="bg-gradient-to-t from-slate-900 via-gray-800 to-gray-700 dark:from-black dark:via-gray-900 dark:to-gray-800 sm:hidden h-20 w-full px-6 rounded-t-3xl flex justify-center items-center fixed bottom-0 left-0 right-0 z-50 max-w-screen-xl mx-auto shadow-2xl border-t border-slate-700/50 dark:border-gray-600/50 backdrop-blur-xl" style={{ marginBottom: 0 }}>
      <ul className="flex relative h-full">
        <span
          className="bg-gradient-to-r from-blue-500 to-emerald-500 h-16 w-16 absolute -top-7 rounded-full ml-2 -z-10 shadow-xl"
          style={{
            transform: getTranslateValue(activeIndex),
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            willChange: 'transform'
          }}
        >
          <span
            className="w-3.5 h-3.5 bg-transparent absolute top-7 -left-[14px] 
          rounded-tr-[11px] shadow-lg"
          ></span>
          <span
            className="w-3.5 h-3.5 bg-transparent absolute top-7 -right-[14px] 
          rounded-tl-[11px] shadow-lg"
          ></span>
        </span>
        {tabs.map((tab, i) => (
          <li key={i} className="w-20 h-full flex justify-center items-center">
            <Link
              to={`/${tab.name.toLowerCase()}`}
              className="flex flex-col text-center w-full h-full group"
            >
              <span
                className={`text-xl cursor-pointer transition-all duration-500 ease-in-out flex flex-col justify-center items-center h-full ${i === activeIndex && "-mt- text-white"
                  }`}
              >
                <div className={`scale-110 mt-2 transition-all duration-500 ease-in-out ${i === activeIndex && "-translate-y-6"
                  }`}>
                  {i === activeIndex ? (
                    <tab.component isActive={true} />
                  ) : (
                    <tab.component isActive={false} />
                  )}
                </div>
                <span
                  className={`transition-all text-slate-300 dark:text-gray-400 duration-500 ease-in-out font-medium ${activeIndex === i
                    ? "translate-y-2 opacity-100 text-white"
                    : "translate-y-10 opacity-0"
                    }`}
                >
                  {tab.name}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NavBar;
