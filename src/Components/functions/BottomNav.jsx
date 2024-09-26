import React, { useState, useEffect } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom"; // Import Link component

function BottomNav() {
  return (
    <div>
      <div className="pb-8 fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around items-center h-24 shadow-md">
        <div className="text-center">
          <div className="block text-white text-xl hover:text-yellow-300">
            <Link to="/dashboard">Home</Link>
          </div>
        </div>
        <div className="text-center">
          <div className="block text-white text-xl hover:text-yellow-300">
            <Link to="/Tracker">Trackers</Link>
          </div>{" "}
        </div>
        <div className="text-center">
          <div className="block text-white text-xl hover:text-yellow-300">
            <Link to="/Progress">Progress</Link>
          </div>{" "}
        </div>
        <div className="text-center">
          <div className="block text-white text-xl hover:text-yellow-300">
            <Link to="/Workout">Workout</Link>
          </div>{" "}
        </div>

      </div>
    </div>
  );
}

export default BottomNav;
