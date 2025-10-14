import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header/Header'
import PhoneFooter from '../components/phoneFooter'
import Footer from '../components/Footer'
import PhoneHeader from '../components/Header/phoneHeader'
import bookmarkStroke from '/bookmarkStroke.svg'
import bookmark from '/bookmark.svg'

function ExperimentTemplate({ experiments }) {
  const navigate = useNavigate();
  const { name } = useParams();
  const experiment = experiments.find(exp => exp.name === name);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    // Check if the experiment is already bookmarked on component mount
    let existingExperiment = JSON.parse(localStorage.getItem("experiments")) || [];
    const isExisting = existingExperiment.some(item => item.name === experiment.name);
    setIsBookmarked(isExisting);
  }, [experiment]);

  function save() {
    // Get existing data from localStorage and ensure it's an array
    let existingExperiment = JSON.parse(localStorage.getItem("experiments")) || [];
    
    // Check if experiment already exists in the array
    const isExisting = existingExperiment.some(item => item.name === experiment.name);
    
    if (!isExisting) {
      // Add new experiment to the existing data array
      const newData = [...existingExperiment, { ...experiment }];
      localStorage.setItem("experiments", JSON.stringify(newData));
      console.log("Added to bookmarks");
      setIsBookmarked(true); // Update bookmark status
    } else {
      // Remove the experiment from bookmarks
      const newData = existingExperiment.filter(item => item.name !== experiment.name);
      localStorage.setItem("experiments", JSON.stringify(newData));
      console.log("Removed from bookmarks");
      setIsBookmarked(false); // Update bookmark status
    }
  }

  return ( 
    <div className="w-full pb-96 relative sm:pb-48 min-h-screen flex flex-col items-center pt-12 -mt-[50px]  transition-colors duration-500 bg-[#FDFDFD] dark:bg-gradient-to-b dark:from-[#101214] dark:from-20% dark:to-[#1B1D20] dark:to-80%">
      
      {/* Back button */} 
      <div className='w-10/12 mb-4 mt-10 flex flex-row justify-center items-center'> 
        <button onClick={() => navigate(-1)} className="w-2/12 flex items-center"> 
          <div className='w-10 h-10 rounded-full bg-[#5B93FF] flex items-center justify-center'>
            <img src="/leftArrow.svg" alt="leftArrow"/>
          </div>
        </button> 
        <h2 className="text-3xl w-10/12 text-white font-bold">{experiment.title}</h2>
        
        <img 
          src={isBookmarked ? bookmark : bookmarkStroke}
          alt="bookmark" 
          onClick={() => save()} 
        />
        
      
      </div>
      {/* Title */}
      <div className="sm:w-full w-11/12  max-w-2xl mb-8">
        <iframe
          className="w-full aspect-video rounded shadow-lg"
          src={experiment.videoSrc}
          title={experiment.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {/* What you need */}
      <div className="sm:w-full w-11/12 max-w-2xl mb-8 bg-white p-6 rounded shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Хэрэглэгдэхүүн</h3>
        <ul className="list-disc list-inside">
          {experiment.materials.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
      {/* How to do it */}
      <div className="sm:w-full w-11/12 max-w-2xl mb-8 bg-white p-6 rounded shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Алхам</h3>
        <ol className="list-decimal list-inside">
          {experiment.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
      
      <Footer/><PhoneFooter/>
    </div>
  );
}

export default ExperimentTemplate
