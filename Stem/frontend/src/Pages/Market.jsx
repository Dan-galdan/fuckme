import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Body/Card';
import {items} from '../Datas/Items'
import Header from '../components/Header/Header';
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer';
import PhoneHeader from '../components/Header/phoneHeader'

// Enhanced icons
const ShoppingBagIcon = () => (
  <svg className="w-8 h-8 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

function Market() {
  return (
    <div className='w-full pt-20 flex items-center flex-col min-h-screen pt-12 -mt-[50px] transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black'>
      <div className="max-w-7xl mx-auto px-4">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
              <ShoppingBagIcon />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
              Маркет
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-gray-400">
            STEM сурах бичиг, туршилтын хэрэгсэл болон бусад материал
          </p>
        </div>
        
        {/* Enhanced Grid */}
        <div className='w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-16'>
          {items.map(data =>(
            <Card
            key={data.id} 
            id={data.id} 
              title={data.title} 
              description={data.description}
              name={data.name}
              type="items"
              img={data.img}
              price={data.price} 
              path={`/market/${data.name}`} 
              />
            ))
          }
        </div>
      </div>
      
      <Footer/>
      <PhoneFooter/>
    </div>
  )
}

export default Market;
