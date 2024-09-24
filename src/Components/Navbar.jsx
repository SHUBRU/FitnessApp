import React, { useState, useEffect } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom"; // Import Link component
import Login from "./com/Login";

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <div className="fixed w-full z-20 top-0 left-0 border-b">
        <div className="flex justify-between items-center px-4 py-3 md:justify-start md:space-x-10 bg-white bg-opacity-30 backdrop-filter backdrop-blur-md backdrop-saturate-150">
          <div className="flex justify-start">
            <Link to="/">
              <img src={""} alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {windowWidth >= 768 && (
            <div>
              <div className="flex justify-center">
                <div className="hidden md:flex md:items-center md:w-auto">
                  <nav className="bg-transparent">
                    <ul className="flex space-x-4">
                      <li>
                        <Link
                          to="/"
                          className="text-gray-900 hover:text-blue-700"
                        >
                          Home
                        </Link>
                        <Link
                          to="/CalorieGoals"
                          className="text-gray-900 hover:text-blue-700"
                        >
                          Calorie Tracker
                        </Link>
                        <Link
                          to="/Training"
                          className="text-gray-900 hover:text-blue-700"
                        >
                          Workout Tracker
                        </Link>
                        <Link
                          to="/WeightProgress"
                          className="text-gray-900 hover:text-blue-700"
                        >
                          Weight Progress
                        </Link>
                        <Link
                          to="/TrainingProgress "
                          className="text-gray-900 hover:text-blue-700"
                        >
                          Training Progress
                        </Link>
                        <Link
                          to="/Competition"
                          className="text-gray-900 hover:text-blue-700"
                        >
                          Competition
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <Login />
            </div>
          )}

          <nav className="bg-transparent">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-gray-900 hover:text-blue-700">
                  Home
                </Link>
                <Link
                  to="/CalorieGoals"
                  className="text-gray-900 hover:text-blue-700"
                >
                  Calorie Tracker
                </Link>
                <Link
                  to="/Training"
                  className="text-gray-900 hover:text-blue-700"
                >
                  Workout Tracker
                </Link>
                <Link
                  to="/WeightProgress"
                  className="text-gray-900 hover:text-blue-700"
                >
                  Weight Progress
                </Link>
                <Link
                  to="/TrainingProgress "
                  className="text-gray-900 hover:text-blue-700"
                >
                  Training Progress
                </Link>
                <Link
                  to="/Competition"
                  className="text-gray-900 hover:text-blue-700"
                >
                  Competition
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
