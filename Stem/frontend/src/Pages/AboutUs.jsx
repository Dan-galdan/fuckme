import { useState } from 'react'
import Header from '../components/Header/Header'
import PhoneHeader from '../components/Header/phoneHeader'
import PhoneFooter from '../components/phoneFooter'

import Footer from '../components/Footer'
function AboutUs() {

  return (
      <div className=' pb-80 relative sm:pb-48 w-full min-h-screen dark:text-white text-black pt-12 sm:-mt-[50px] -mt-[65px] transition-colors duration-500 bg-[#FDFDFD] dark:bg-gradient-to-b dark:from-[#101214] dark:from-20% dark:to-[#1B1D20] dark:to-80% flex flex-col items-center'>
        


        <h1 className='text-3xl font-bold mt-20 sm:mt-20 '>Бидний тухай</h1>
        <p>Home / About us</p>


        <div className='sm:w-11/12 w-10/12 flex-wrap-reverse sm:mt-24 mt-10 flex sm:flex-row justify-center gap-10 sm:gap-40 items-center'>
          <div className='sm:w-1/3 flex flex-col justify-center items-center'>
            <h1 className='text-2xl w-full font-bold'>Who we are</h1>
             <p className='text-lg font-semibold w-full mt-4'>Тухайн төсөл нь Амжилт Кибер сургуулийн 2025 оны 6-11
            дүгээр ангийн сурагчдын зүгээс Физик, Химийн судлагдахууны хүрээнд зохион байгуулсан болно.</p>
          
          </div>
          <div className='w-full sm:w-1/3 h-72 rounded-xl'>
          <img src="https://i.pinimg.com/736x/f7/a3/99/f7a399e2dad99d36e3a8a72cab37b19b.jpg" alt="" className='h-full w-full object-cover scale-75' />
          </div>
        </div>



        <div className='sm:w-9/12  mt-24 flex sm:flex-row flex-col justify-center items-center'>
          <div className='flex h-72 flex-col rounded-tr-3xl sm:rounded-tr-none sm:rounded-l-2xl items-center p-6 sm:p-12 w-10/12 sm:w-1/2 bg-gradient-to-bl from-[rgba(45,45,45,0.4)] via-[rgba(113,126,121,0.3)] to-[rgba(28,44,37,0.3)]'>
            <h1 className='w-full text-3xl font-semibold mb-4'>Алсын хараа</h1>
            <p className='w-full text-md'>
            Физикийн контент хичээлүүд, туршилтуудаараа Монголын боловсролын системийн 
            томоохон хэсэг болж, сургуулиудын STEM судлагдахууны тулгуур болох.</p>
          </div>
          <div className='flex h-72 flex-col rounded-bl-3xl sm:rounded-bl-none sm:rounded-r-2xl justify-center items-center p-6 sm:p-12 w-10/12 sm:w-1/2 bg-gradient-to-bl from-[rgba(45,45,45,0.4)] via-[rgba(113,126,121,0.3)] to-[rgba(28,44,37,0.3)]'>
            <h1 className='w-full text-3xl font-semibold mb-4'>Зорилго & Зорилт</h1>
            <p className='w-full text-md'>
            Сургуулиудад физик лабораторийн хомсдолыг шийдвэрлэхийн тулд виртуал STEM туршилтууд, видео, интерактив агуулгыг
            санаачлан сурагчдын сонирхлыг төрүүлж, STEM салбарт ирээдүйн шинэ санаачлагчдыг бэлтгэх зорилготой.</p>
          </div>
        </div>




        <div className='w-full flex flex-col justify-center items-center mb-16'>
          <h1 className='text-3xl font-bold mt-20 '>Манай баг</h1>
          <div className='w-full flex sm:flex-row flex-col items-center justify-center '>
            <div className='sm:w-1/2 sm:h-80 sm:h-auto flex flex-col items-center'>
              <h1 className='text-xl font-semibold p-8'>MANAGEMENT TEAM</h1>
              <div className='flex w-full gap-2'>
                <h1 className='text-md font-semibold w-1/2 text-end'>Санаачлагч</h1>
                <h1 className='text-md font-light w-1/2'>Г. Давааням</h1>
              </div>
              <div className='flex w-full gap-2'>
                <h1 className='text-md font-semibold w-1/2 text-end'>Хамтран санаачлагч</h1>
                <h1 className='text-md font-light w-1/2'>Баярцэцэг</h1>
              </div>
              <div className='flex w-full gap-2'>
                <h1 className='text-md font-semibold w-1/2 text-end'>Оролцогчид</h1>
                <h1 className='text-md font-light w-1/2'>Амжилт Кибер сургуулийн <br />
                6-11 ангийн сурагчид</h1>
              </div>
            </div>
            <div className='sm:w-1/2 h-80 sm:h-auto flex flex-col items-center'>
              <h1 className='text-xl font-semibold p-8'>DEVELOPMENT TEAM</h1>
              <div className='flex w-full gap-2'>
                <h1 className='text-md font-semibold w-1/2 text-end'>Frontend хөгжүүлэгч</h1>
                <h1 className='text-md font-light'>Б. Бат-Эрдэнэ <br/> М. Гантулга</h1>
                
              </div>
              <div className='flex w-full gap-2'>
                <h1 className='text-md font-semibold w-1/2 text-end'>Backend хөгжүүлэгч</h1>
                <h1 className='text-md font-light'>Х. Төгөлдөр</h1>
              </div>
              <div className='flex w-full gap-2'>
                <h1 className='text-md font-semibold w-1/2 text-end'>UI/UX дизайнер</h1>
                <h1 className='text-md font-light'>Б. Бат-Энх <br />
                Л. Сарангэрэл</h1>
              </div>
            </div>
          </div>
        </div> 
        
        <PhoneFooter/>
        <Footer/><PhoneFooter/>
      </div>
  )
}

export default AboutUs
 