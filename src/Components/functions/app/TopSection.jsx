import React, { useState, useEffect } from "react";
import Login from "../../com/Login";
import { Link } from "react-router-dom"; // Import Link component

const TopSection = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to toggle shrinking effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out bg-black flex items-center justify-between ${
        isScrolled ? "p-2 h-16" : "p-6 h-32"
      } rounded-b-lg shadow-lg`}
    >
      {/* Left: Logo */}
      <div className="flex items-center">
        <img
          src="https://via.placeholder.com/50"
          alt="Logo"
          className="w-12 h-12"
        />
        {/* Hide "Hello!" when scrolled */}
        {!isScrolled && (
          <h1 className="text-white font-bold ml-4 text-xl transition-opacity duration-300">
            HELLO!
          </h1>
        )}
      </div>
      <Login />
      {/* Right: Profile icon with settings */}
      <Link to="/Settings">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white">👤</span>
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">⚙️</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default TopSection;
