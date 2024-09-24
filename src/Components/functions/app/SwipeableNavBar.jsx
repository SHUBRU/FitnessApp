import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import Swiper styles
import ProgressGraph from './ProgressGraph';
import CompetitionPage from './CompetitionPage';

const SwipeableNavBar = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null); // Store Swiper instance
  const [isSticky, setIsSticky] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle tab click (sync with swiper slide)
  const handleTabClick = (index) => {
    setActiveTab(index);
    if (swiperInstance) {
      swiperInstance.slideTo(index); // Change swiper slide on tab click
    }
  };

  // Sync the active tab with the Swiper activeIndex
  const handleSlideChange = (swiper) => {
    setActiveTab(swiper.activeIndex);
  };

  // Handle scroll event to make swipebar sticky after the grey section scrolls away
  useEffect(() => {
    const handleScroll = () => {
      const swipeBarPosition = document.getElementById("swipeable-navbar").offsetTop;
      const scrollY = window.scrollY;

      // Set scroll position to control the fade out
      setScrollPosition(scrollY);

      // Make swipe bar sticky when it reaches the top of the viewport
      if (scrollY >= swipeBarPosition) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      {/* Static Grey Section with Text and Fade-out Effect */}
      <div className="bg-gradient-to-b from-gray-700 to-gray-400 h-48 flex justify-center items-center">
        <h1
          className="text-white font-bold text-3xl transition-opacity duration-500"
          style={{
            opacity: scrollPosition > 0 ? 1 - scrollPosition / 150 : 1, // Fade out as you scroll, but stay fully visible when scroll is at the top
          }}
        >
          What Ever It Takes
        </h1>
      </div>

      {/* Swipeable Navbar */}
      <div
        id="swipeable-navbar"
        className={`${
          isSticky ? 'sticky top-0 z-10' : ''
        } bg-white shadow-lg`}
      >
        <div className="flex justify-around py-2 border-b-2">
          <div
            className={`flex-1 text-center cursor-pointer py-2 font-bold ${
              activeTab === 0 ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-500'
            } border-b-2`}
            onClick={() => handleTabClick(0)}
          >
            Workout
          </div>
          <div
            className={`flex-1 text-center cursor-pointer py-2 font-bold ${
              activeTab === 1 ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-500'
            } border-b-2`}
            onClick={() => handleTabClick(1)}
          >
            Calories
          </div>
          <div
            className={`flex-1 text-center cursor-pointer py-2 font-bold ${
              activeTab === 2 ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-500'
            } border-b-2`}
            onClick={() => handleTabClick(2)}
          >
            Weight
          </div>
          <div
            className={`flex-1 text-center cursor-pointer py-2 font-bold ${
              activeTab === 3 ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-gray-500'
            } border-b-2`}
            onClick={() => handleTabClick(3)}
          >
            Skipping
          </div>
        </div>
      </div>

      {/* Swipeable Views */}
      <div className={`${isSticky ? 'pt-16' : ''} transition-all duration-300`}>
        <Swiper
          onSwiper={setSwiperInstance} // Capture swiper instance when it's initialized
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={handleSlideChange} // Handle swiper slide change
          initialSlide={activeTab} // Sync with active tab on initial load
        >
          <SwiperSlide>
            <div className="p-4 text-center">
              <ProgressGraph />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-4 text-center">This is the Calorie section.</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-4 text-center">This is the Weight section.</div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="p-4 text-center">
              <CompetitionPage />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default SwipeableNavBar;
