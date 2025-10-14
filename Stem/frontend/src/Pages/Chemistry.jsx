import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chemistry } from '../Datas/Chemistry';
import PhoneHeader from '../components/Header/phoneHeader'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer';

// Enhanced icons
const FlaskIcon = () => (
  <svg className="w-16 h-16 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-5-9V3" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

function Chemistry() {
  return (
    <div className="w-full dark:text-white text-slate-900 min-h-screen flex flex-col items-center pt-12 -mt-[50px] transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        {/* Enhanced 404 Design */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 scale-150"></div>
          <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-8 shadow-2xl">
            <FlaskIcon />
          </div>
        </div>
        
        <h1 className='text-8xl sm:text-9xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6'>
          404
        </h1>
        
        <div className="space-y-4 mb-8">
          <h1 className='text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white'>
            Химийн хуудас олдсонгүй
          </h1>
          <p className='text-lg sm:text-xl text-slate-600 dark:text-gray-400 max-w-md'>
            Таны хайж буй хуудас одоогоор бэлэн болоогүй байна.
          </p>
        </div>
        
        <Link 
          to="/" 
          className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <HomeIcon />
          Нүүр хуудас руу буцах
        </Link>
      </div>
      
      <Footer/>
      <PhoneFooter/>
    </div>
  )
}

export default Chemistry;
