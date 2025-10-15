import { useState } from 'react'
import Header from '../components/Header/Header'
import PhoneHeader from '../components/Header/phoneHeader'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import email from '../assets/email.svg'
import call from '../assets/call.svg'
function Surtchilgaa() {

    return (
        <div className=' pb-80 relative sm:pb-48 w-full min-h-screen text-black dark:text-white pt-12 -mt-[50px]  transition-colors duration-500 bg-[#FDFDFD] dark:bg-gradient-to-b dark:from-[#101214] dark:from-20% dark:to-[#1B1D20] dark:to-80% flex flex-col items-center'>



            <h1 className='text-3xl font-bold mt-10 sm:mt-20 '>Сурталчилгаа байршуулах</h1>
            <p>Нүүр / Сурталчилгаа байршуулах </p>


            <div className='w-10/12 gap-32  mt-24 mb-10 flex flex-col sm:flex-row items-center justify-center'>
                <div>
                    <div className='w-14 h-14 rounded-xl bg-[#5B93FF] flex justify-center items-center'>
                        <img src={call} alt="call" />
                    </div>
                    <h1 className='font-semibold text-lg w-40 sm:w-auto'>Цахим хаяг</h1>
                    <p>davaanyam2922@gmail.com</p>
                </div>
                <div>
                    <div className='w-14 h-14 rounded-xl bg-[#5B93FF] flex justify-center items-center'>
                        <img src={email} alt="email" />
                    </div>
                    <h1 className='font-semibold text-lg w-40 sm:w-auto'>Утас</h1>
                    <p>+976 88637861    </p>
                </div>
                <div className='font-semibold sm:font-normal text-lg'>
                    <p>Цахим хаяг болон утсаар холбогдож <br /> сурталчилгаа байршуулна уу.</p>
                </div>
            </div>

            <PhoneFooter />
            <Footer /><PhoneFooter />
        </div>
    )
}

export default Surtchilgaa
