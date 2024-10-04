import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase'; // Import Firebase auth
import { useNavigate } from 'react-router-dom'; // To navigate after logout

const SettingsPage = () => {
  const [showLogin, setShowLogin] = useState(false); // To toggle login modal visibility
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null); // User authentication state
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Scroll effect to toggle header shrinking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Handle back button click
  const handleBackClick = () => {
    window.history.back(); // Navigate to the previous page
  };

  // Simulate login/logout
  const toggleLoginModal = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Logout error: ', error);
    }
  };

  // This useEffect simulates checking the authentication state
  useEffect(() => {
    const fakeAuthCheck = setTimeout(() => {
      // Simulate a user being logged in
      setUser({ name: 'John Doe' });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(fakeAuthCheck);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* Top Profile Section */}
      <div
        className={`w-full transition-all duration-300 ease-in-out bg-gradient-to-b from-black to-gray-800 p-8 ${
          isScrolled ? 'pt-2 pb-2' : 'pt-16 pb-8'
        } text-center fixed top-0 left-0 right-0 z-10`}
      >
        {/* Minimalist Back Button */}
        <button
          onClick={handleBackClick}
          className="absolute top-4 left-4 bg-transparent border-none text-white text-xl"
          aria-label="Go back"
        >
          ←
        </button>

        <div className={`transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
          <img
            className="w-24 h-24 rounded-full mx-auto"
            src="https://via.placeholder.com/150"
            alt="User Profile"
          />
        </div>
        <h2 className={`text-white font-bold transition-opacity duration-500 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}>
          Your account
        </h2>
      </div>

      {/* Main Content */}
      <div className="pt-40">
        {/* Your Account Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mx-4 mb-6 pt-20">
          <h3 className="text-lg font-semibold mb-4">Your account</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center space-x-3">
                <i className="fas fa-wrench text-gray-500"></i>
                <span>Edit account</span>
              </div>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center space-x-3">
                <i className="fas fa-envelope text-gray-500"></i>
                <span>Edit account email</span>
              </div>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center space-x-3">
                <i className="fas fa-lock text-gray-500"></i>
                <span>Change password</span>
              </div>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center space-x-3">
                <i className="fas fa-sign-out-alt text-gray-500"></i>
                <span> Log out of account</span>
              </div>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Online Payments Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mx-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Online payments</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center space-x-3">
                <i className="fas fa-credit-card text-gray-500"></i>
                <span>My online payment methods</span>
              </div>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <div className="flex items-center space-x-3">
                <i className="fas fa-history text-gray-500"></i>
                <span>Payment history</span>
              </div>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Additional Links Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mx-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-gray-700">
              <span>Imprint</span>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>Privacy policy</span>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
            <div className="flex items-center justify-between text-gray-700">
              <span>General terms and conditions</span>
              <i className="fas fa-chevron-right text-gray-500"></i>
            </div>
          </div>
        </div>

        {/* Login/Logout Button at the bottom */}
        <div className="bg-white shadow-md rounded-xl p-6 mx-4 mb-6 pt-20">
          <h3 className="text-lg font-semibold mb-4">Your account</h3>
          {/* Logout Button */}
          {!loading && user && (
            <div className="text-center">
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-6 rounded-full hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
