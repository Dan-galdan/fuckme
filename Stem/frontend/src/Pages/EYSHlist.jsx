import { useState } from 'react'
import { Link } from 'react-router-dom';
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import Lister from '../components/Body/Lister';
import PhoneHeader from '../components/Header/phoneHeader'
function EYSHlist({hicheel}) {
  return (
    <div className="w-full h-full transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">
      <div className="max-w-7xl mx-auto px-6 pt-24">
        <h2 className="text-3xl font-bold mb-16 text-slate-900 dark:text-white text-center">ЭЕШ-ийн бодолтууд</h2>
        <div className="space-y-8 pb-20">
          {hicheel.map(data => (
            <div key={data.id} className="max-w-4xl mx-auto">
              <Lister 
                id={data.id} 
                title={data.title} 
                name={data.name}
                path={`/physic/EYSH_beltgel/${data.name}`} 
                type="eyesh"
              />
            </div>
          ))}
        </div>
      </div>
      <Footer/><PhoneFooter/>
    </div>
  );
}

export default EYSHlist
