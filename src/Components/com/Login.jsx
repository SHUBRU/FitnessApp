import React, { useState, useEffect, useRef } from "react";
import google from "./assets/Google_Logo.png";
import apple from "./assets/Apple_Logo.png";
import { Link } from "react-router-dom";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [hasJustLoggedIn, setHasJustLoggedIn] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function
  const [error, setError] = useState(null);

  console.log(auth?.currentUser?.email);


  //For seeing if you are logged in or not
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Initialize loading state
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false once everything is done
    });
  
    return () => unsubscribe();
  }, []);

  const loginRef = useRef();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (!hasJustLoggedIn) {
          setHasJustLoggedIn(true);
          navigate("/dashboard");
        }} else {
          // If user logs out, reset the flag
          setHasJustLoggedIn(false);
        }
      });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setShowLogin(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toggleLogin();
      setIsLoggedIn(true);
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async () => {
    if (termsAccepted) {
      try { 
        await createUserWithEmailAndPassword(auth, email, password);
        toggleLogin();
      } catch (err) {
        console.error(err);
      }
      setIsLoggedIn(true);
    } else {
      console.error("Terms and Conditions must be accepted to sign up.");
    }
  };

  const login = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful login, e.g., show a success message or redirect the user.
      setEmail(""); // Clear the email input field after successful login
      setPassword(""); // Clear the password input field after successful login
      setError(null); // Clear any previous errors
      toggleLogin();
    } catch (err) {
      setError(err.message); // Set the error state to display the error message to the user.
    }
  };

  const Logout = async () => {
    try {
      await auth.signOut();
      console.log('Successfully logged out');
    } catch (error) {
      console.error('An error occurred while logging out:', error);
    }
  };
  

  return (
    <div>
        {!user && (
          <>
          <button
          className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-4 py-2"
          style={{ position: "absolute", top: "19%", right: "2%" }}
          type="button"
          onClick={toggleLogin}
        >
          Login
        </button>
          </>
        )}

        {user && (
          <>
          <button
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-bold rounded-lg text-sm px-4 py-2"
            style={{ position: "absolute", top: "19%", right: "2%" }}
            onClick={Logout}
          >
            Logout
          </button>
          </>
        )}
        



      <div
        ref={loginRef}
        className={`${
          showLogin ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } transition-opacity transition-transform duration-300 ease-in-out`}
      >
        {showLogin && (
          <div className="flex justify-center absolute">
            <div
              className={`relative py-3 sm:max-w-xl sm:mx-auto `}
              style={{ width: "Auto" }}
            >
              {" "}
              {/* Add a width or your choice */}
              <div className="flipper">
                <div className="front">
                  <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                    <div className="p-4 sm:p-8 md:p-12 w-full max-w-md bg-white rounded-lg shadow-lg relative z-10">
                      <div className="mb-6 text-center">
                        <h1 className="text-2xl font-semibold">
                          {isSignUp ? "Sign Up" : "Login"}
                        </h1>
                      </div>
                      <div className="flex items-center justify-center space-x-4 mt-4">
                        <button className="flex items-center py-2 px-4 text-sm uppercase rounded bg-white hover:bg-gray-100 text-indigo-500 border border-transparent hover:border-transparent hover:text-gray-700 shadow-md hover:shadow-lg font-medium transition transform hover:-translate-y-0.5">
                          <img
                            src={apple}
                            alt="Apple"
                            className="w-6 h-6 mr-2"
                          />
                          Apple
                        </button>
                        <button
                          onClick={signInWithGoogle}
                          className="flex items-center py-2 px-4 text-sm uppercase rounded bg-white hover:bg-gray-100 text-indigo-500 border border-transparent hover:border-transparent hover:text-gray-700 shadow-md hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                        >
                          <img
                            src={google}
                            alt="Google"
                            className="w-6 h-6 mr-2"
                          />
                          Google
                        </button>
                      </div>
                      <div className="mt-6">
                        <form>
                          {isSignUp ? (
                            <div className="back">
                              <>
                                <div className="mb-4">
                                  <input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    type="text"
                                    placeholder="User Name"
                                    onChange={(e) =>
                                      setUserName(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="mb-4">
                                  <input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </div>
                                <div className="mb-4">
                                  <input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="mb-4">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={(e) =>
                                      setSubscribeNewsletter(e.target.checked)
                                    }
                                  />
                                  <label>Subscribe to Newsletter</label>
                                </div>
                                <div className="mb-4">
                                  <input
                                    type="checkbox"
                                    className="mr-2"
                                    onChange={(e) =>
                                      setTermsAccepted(e.target.checked)
                                    }
                                  />
                                  <label>Accept Terms and Conditions</label>
                                </div>
                                <div className="text-center">
                                  <button
                                    className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline"
                                    disabled={!termsAccepted}
                                    onClick={signUp}
                                  >
                                    Sign Up
                                  </button>
                                </div>
                              </>
                            </div>
                          ) : (
                            <div className="front">
                              <>
                                <div className="mb-4">
                                  <input
                                    className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="username"
                                    type="text"
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                  />
                                </div>
                                <div className="mb-4">
                                  <input
                                    className="w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                  />
                                </div>
                                <div className="mb-4">
                                  <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    className="mr-2"
                                  />
                                  <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-600"
                                  >
                                    Remember me
                                  </label>
                                </div>
                                <div className="text-center">
                                  <button
                                    className="w-full py-2 px-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 font-medium transition transform hover:-translate-y-0.5"
                                    onClick={login} // Close login form on click
                                  >
                                    Sign in
                                  </button>
                                </div>
                              </>
                            </div>
                          )}
                          <div className="mt-4 text-center">
                            <span
                              className="text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
                              onClick={toggleSignUp}
                            >
                              {isSignUp
                                ? "Already have an account? Login"
                                : "Create an Account!"}
                            </span>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
