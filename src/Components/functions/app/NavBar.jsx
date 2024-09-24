import React, { useState, useEffect } from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { Link } from 'react-router-dom'; // Import Link component
import logo from "../../../assets/logo.png";
import Login from '../../functions/Login';

const AppNavbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <div className="fixed w-full z-20 top-0 left-0 border-b">
      <div className="flex justify-between items-center px-4 py-3 md:justify-start md:space-x-10 bg-white bg-opacity-30 backdrop-filter backdrop-blur-md backdrop-saturate-150">
        <div className="flex justify-start">
        <Link to="/dashboard">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          </Link>
        </div>

        <div className="md:hidden">
          <div onClick={() => setToggleMenu(!toggleMenu)}>
            {toggleMenu ? (
              <RiCloseLine className="w-6 h-6" />
            ) : (
              <RiMenu3Line className="w-6 h-6" />
            )}
          </div>
        </div>

        {windowWidth >= 768 && (
          <div>
          <div className='flex justify-center'>
            <div className="hidden md:flex md:items-center md:w-auto">
              <nav className="bg-transparent">
                <ul className="flex space-x-4">
                  <li>
                    <Link to="/dashboard" className="text-gray-900 hover:text-blue-700">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/meal-planner" className="text-gray-900 hover:text-blue-700">
                      Meal Planner
                    </Link>
                  </li>
                  <li>
                    <Link to="/MacroAi" className="text-gray-900 hover:text-blue-700">
                      MacroAi
                    </Link>
                  </li>
                  <li>
                    <Link to="/Tracker" className="text-gray-900 hover:text-blue-700">
                      Tracker
                    </Link>
                  </li>
                  <li>
                    <Link to="/help" className="text-gray-900 hover:text-blue-700">
                      About Us
                    </Link>
                  </li>

                    {/** PAges of App2 */}

                  <li>
                  <Link to="/das" className="text-gray-900 hover:text-blue-700 ml-10 mr-10">
                    I App2 I
                  </Link>
                </li>
                <li>
                  <Link to="/Home" className="text-gray-900 hover:text-blue-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/Document-Scanner" className="text-gray-900 hover:text-blue-700">
                    Document Scanner
                  </Link>
                </li>
                <li>
                  <Link to="/Email" className="text-gray-900 hover:text-blue-700">
                    Email
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-gray-900 hover:text-blue-700">
                    Account
                  </Link>
                </li>
                </ul>
              </nav>
            </div>
            </div>
              <Login/>
          </div>
        )}


        {toggleMenu && (
            <nav>
              <ul className="flex flex-col space-y-4 ">
                <li>
                  <Link to="/dashboard" className="text-gray-900 hover:text-blue-700">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/meal-planner" className="text-gray-900 hover:text-blue-700">
                    Meal Planner
                  </Link>
                </li>
                <li>
                  <Link to="/MacroAi" className="text-gray-900 hover:text-blue-700">
                  MacroAi
                  </Link>
                </li>
                <li>
                  <Link to="/Tracker" className="text-gray-900 hover:text-blue-700">
                   Tracker
                  </Link>
                </li>
                <li>
                  <Link to="/Help" className="text-gray-900 hover:text-blue-700">
                    About Us
                  </Link>
                </li>
                    
                  {/** PAges of App2 */}
                
                <li>
                  <Link to="/das" className="text-gray-900 hover:text-blue-700">
                    New Pages
                  </Link>
                </li>
                <li>
                  <Link to="/Home" className="text-gray-900 hover:text-blue-700">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/Document-Scanner" className="text-gray-900 hover:text-blue-700">
                    Document Scanner
                  </Link>
                </li>
                <li>
                  <Link to="/Email" className="text-gray-900 hover:text-blue-700">
                    Email
                  </Link>
                </li>
                <li>
                  <Link to="/account" className="text-gray-900 hover:text-blue-700">
                    Account
                  </Link>
                </li>
              </ul>
            </nav>
        )}
      </div>



      </div>
      </div>
  );
};

export default AppNavbar;
