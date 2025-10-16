import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import PhoneHeader from '../components/Header/phoneHeader'
import bookmarkStroke from '../assets/bookmark-stroke.svg'
import bookmark from '../assets/bookmark.svg'

function EYSHtemplate({ hicheel }) {
  const navigate = useNavigate();
  const { name } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const bodlogo = hicheel.find(item => item.name === name);

  // Format title function in Mongolian
  const formatTitle = (title) => {
    // Extract year and exercise letter from title
    const yearMatch = title.match(/(20\d{2})/);
    const exerciseMatch = title.match(/\b([A-D])\b/i); // Matches A, B, C, D

    const year = yearMatch ? yearMatch[1] : '2024'; // Default to 2024 if no year found
    const exercise = exerciseMatch ? exerciseMatch[1].toUpperCase() : 'A'; // Default to A if no exercise found

    return `Математик ЭЕШ ${year} задгай даалгавар ${exercise} хувилбар`;
  };

  console.log('URL name:', name);
  console.log('Found bodlogo:', bodlogo);

  if (!bodlogo) {
    navigate('/EYSH_beltgel');
    return null;
  }

  useEffect(() => {
    // Check if the experiment is already bookmarked on component mount
    let existingExperiment = JSON.parse(localStorage.getItem("eyesh")) || [];
    const isExisting = existingExperiment.some(item => item.name === bodlogo.name);
    setIsBookmarked(isExisting);
  }, [bodlogo]);

  function save() {
    // Get existing data from localStorage and ensure it's an array
    let existingEyesh = JSON.parse(localStorage.getItem("eyesh")) || [];

    // Check if Eyesh already exists in the array
    const isExisting = existingEyesh.some(item => item.name === bodlogo.name);

    if (!isExisting) {
      // Add new Eyesh to the existing data array
      const newData = [...existingEyesh, { ...bodlogo }];
      localStorage.setItem("eyesh", JSON.stringify(newData));
      console.log("Added to bookmarks");
      setIsBookmarked(true); // Update bookmark status
    } else {
      // Remove the Eyesh from bookmarks
      const newData = existingEyesh.filter(item => item.name !== bodlogo.name);
      localStorage.setItem("eyesh", JSON.stringify(newData));
      console.log("Removed from bookmarks");
      setIsBookmarked(false); // Update bookmark status
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-12 -mt-[50px] transition-colors duration-500 bg-gradient-to-b from-slate-50 to-white dark:bg-gradient-to-b dark:from-gray-900 dark:to-black">

      {/* Back button */}
      <div className='w-10/12 h-10 mb-8 mt-16 flex flex-row justify-center items-center'>
        <button onClick={() => navigate(-1)} className="flex w-2/12 items-center">
          <div className='w-10 h-10 rounded-full bg-[#5B93FF] flex items-center justify-center'>
            <img src="/leftArrow.svg" alt="leftArrow" />
          </div>
        </button>

        {/* Updated Title in Mongolian */}
        <h2 className="sm:text-3xl text-xl w-10/12 text-centet text-slate-900 dark:text-white font-bold mb-4">
          {formatTitle(bodlogo.title)}
        </h2>

        <img
          src={isBookmarked ? bookmark : bookmarkStroke}
          alt="bookmark"
          onClick={() => save()}
        />
      </div>

      {/* Video */}
      <div className="w-11/12 sm:10/12 mt-48 sm:mt-0 flex flex-col items-center mb-24 pb-24">
        <iframe
          className='w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px]'
          src={bodlogo.videoSrc}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      <Footer />
    </div>
  );
}

export default EYSHtemplate