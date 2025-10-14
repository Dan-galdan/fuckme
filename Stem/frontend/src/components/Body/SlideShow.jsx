import React, { useState } from 'react';
import play from '/play.svg'
const slides = [
  {
    id: 1,
    title: 'Бүхий л туршилтуудыг Amjilt STEM-ээс...',
    content: '1 сарын өмнө / 09:10',
    imageUrl: 'https://i.pinimg.com/736x/16/9a/81/169a8148f017d2097d6ab08236218437.jpg', // Placeholder image
  },
  {
    id: 2,
    title: 'Шинжлэх ухааны гайхамшгийг мэдэрцгээе',
    content: '14 хоногийн өмнө / 10:20',
    imageUrl: 'https://i.pinimg.com/736x/b9/39/17/b939172de2cc9365b10461143eaa7bd1.jpg', // Placeholder image
  },
  {
    id: 3,
    title: 'Технологийн дэвшлийг Шинжлэх ухаанаас',
    content: 'Өчигдөр / 11:30',
    imageUrl: 'https://i.pinimg.com/736x/47/f4/89/47f489501af5789db3cd0ce31a803654.jpg', // Placeholder image
  },
];

function SlideShow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  return (
    
      <div className={`w-full flex flex-row justify-center items-center sm:gap-8 gap-2`} >
        <button 
            className="bg-[#5B93FF] rounded-full sm:w-10 sm:h-10 w-5 h-5 flex justify-center items-center"
            onClick={prevSlide}
          >
            <img src="/leftArrow.svg" alt="leftArrow" className='sm:scale-100 scale-75'/>
        </button>
        <div className='w-10/12 sm:h-[500px] h-[200px] flex flex-col justify-end items-start p-5' style={{
            backgroundImage: `url("${slides[currentSlide].imageUrl}")`,
            backgroundSize: 'cover', 
            backgroundPosition: 'center'

        }}>
          <div className='flex sm:gap-6 gap-2 pb-2'>
            <button className='bg-black rounded-full sm:w-10 sm:h-10 w-5 h-5 flex justify-center items-center'>
            <img src={play} alt="play" className='sm:scale-100 scale-50' />
            </button>
            <button className='bg-black rounded-full sm:w-10 sm:h-10 w-5 h-5 flex justify-center items-center'>
            <img src="/bookmark.svg" alt="bookmark" className='scale-50 sm:scale-90'/>
            </button>
          </div>
          <div className='p-2 rounded-xl  w-2/3'>
          <h2 className="sm:text-[40px] opacity-100 text-[10px] font-extrabold text-white text-left">{slides[currentSlide].title}</h2>
          <p className="sm:text-xl text-[5px] font-medium text-white ">{slides[currentSlide].content}</p>
          </div>
        </div>
        
          
        <button 
            className="bg-[#5B93FF] rounded-full sm:w-10 sm:h-10 w-5 h-5 flex justify-center items-center"
            onClick={nextSlide}
        >
            <img src="/rightArrow.svg" alt="rightArrow" className='sm:scale-100 scale-75'/>
        </button>
        
      </div>
    
  );
}

export default SlideShow;
