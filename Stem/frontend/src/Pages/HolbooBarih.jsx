import { useState } from 'react'
import PhoneHeader from '../components/Header/phoneHeader'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import email from '/email.svg'
import call from '/call.svg'
import location from '/location.svg'
function HolbooBarih() {

  return (
      <div className=' pb-96 relative sm:pb-48 w-full min-h-screen text-black dark:text-white pt-12 -mt-[50px]  transition-colors duration-500 bg-[#FDFDFD] dark:bg-gradient-to-b dark:from-[#101214] dark:from-20% dark:to-[#1B1D20] dark:to-80% flex flex-col items-center'>
        


        <h1 className='text-3xl font-bold mt-10 sm:mt-20 '>Холбоо барих</h1>
        <p>Нүүр / Холбоо барих </p>


        <div className='w-10/12 gap-20 sm:gap-32 mt-14 sm:mt-24 mb-10 flex flex-col sm:flex-row items-center justify-center'>
            <div className='sm:h-60 w-64 sm:w-auto'>
                <div className='w-14 h-14 rounded-xl bg-[#5B93FF] flex justify-center items-center'>
                    <img src={location} alt="email" />
                </div>
                <h1 className='font-semibold text-lg'>Хаяг</h1>
                <p>Амжилт Кибер сургууль, Нарны <br /> зам, 25 хороо, Улаанбаатар хот, <br /> Монгол Улс</p>
            </div>
            <div className='sm:h-60 w-64 sm:w-auto'>
                <div className='w-14 h-14 rounded-xl bg-[#5B93FF] flex justify-center items-center'>
                    <img src={call} alt="call" />
                </div>
                <h1 className='font-semibold text-lg'>Цахим хаяг</h1>
                <p>davaanyam2922@gmail.com</p>
            </div>
            <div className='sm:h-60 w-64 sm:w-auto'>
                <div className='w-14 h-14 rounded-xl bg-[#5B93FF] flex justify-center items-center'>
                    <img src={email} alt="email" />
                </div>
                <h1 className='font-semibold text-lg'>Утас</h1>
                <p>+976 88637861</p>
            </div>
            
        </div>

        <PhoneFooter/>
        <Footer/><PhoneFooter/>
      </div>
  )
}

export default HolbooBarih
 