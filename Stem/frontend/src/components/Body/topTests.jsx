import SlideShow from './SlideShow';
function Welcome() {
  return (
    <div className="w-full sm:h-[684px] h-[310px] pt-5 relative sm:mt-10 flex flex-col items-center gap-10">
        <div className='flex items-center gap-4 w-10/12'>
        <h1 className='text-black dark:text-white sm:text-4xl text-2xl font-bold' >Бидний  туршилтууд</h1><p className='text-gray-500 sm:text-xl text-sm'>энэ сард</p>
        </div>
        <SlideShow/>
    </div>
  )
}

export default Welcome;
