import React, { useState, useEffect, useRef } from "react";
import google from "./assets/Google_Logo.png";
import apple from "./assets/Apple_Logo.png";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      if (loggedInUser) {
        setUser(loggedInUser);
        navigate("/dashboard"); // Navigate to dashboard upon successful login
      } else {
        setUser(null);
      }
      setLoading(false); // Set loading to false once everything is done
    });
    return () => unsubscribe();
  }, [navigate]);

  const toggleSignUp = () => setIsSignUp(!isSignUp);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const signIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signUp = async (e) => {
    e.preventDefault();
    if (termsAccepted) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        console.error(err);
      }
    }
  };

  // If the user is logged in, do not show the login form
  if (user) {
    return null; // Hide the login form when the user is logged in
  }

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('/path-to-placeholder-image.jpg')",
          filter: "blur(6px)",
        }}
      ></div>

      {/* Login Form */}
      {!user && !loading && (
        <div className="relative z-10 w-full max-w-sm bg-white p-6 rounded-lg shadow-lg mx-4">
          <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>

          {/* Social login buttons */}
          <div className="flex justify-between gap-2 mb-6">
            <button
              className="flex items-center justify-center w-1/2 px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-300"
              onClick={signInWithGoogle}
            >
              <img src={google} alt="Google" className="w-6 h-6 mr-2" />
              Google
            </button>
            <button className="flex items-center justify-center w-1/2 px-4 py-2 bg-gray-100 rounded-lg shadow hover:bg-gray-200 transition duration-300">
              <img src={apple} alt="Apple" className="w-6 h-6 mr-2" />
              Apple
            </button>
          </div>

          {/* Form for email/password login */}
          <form onSubmit={isSignUp ? signUp : signIn}>
            {isSignUp && (
              <input
                className="w-full mb-4 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="text"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
              />
            )}
            <input
              className="w-full mb-4 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full mb-4 px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            {isSignUp && (
              <div className="mb-4">
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label className="text-sm text-gray-600">
                  Accept Terms and Conditions
                </label>
              </div>
            )}

            {/* Login or Sign Up button */}
            <button
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
              type="submit"
              disabled={isSignUp && !termsAccepted}
            >
              {isSignUp ? "Sign Up" : "Sign In"}
            </button>

            {/* Toggle between Sign Up and Login */}
            <div className="mt-4 text-center">
              <span
                className="text-sm text-blue-500 cursor-pointer"
                onClick={toggleSignUp}
              >
                {isSignUp
                  ? "Already have an account? Login"
                  : "Create an Account!"}
              </span>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
