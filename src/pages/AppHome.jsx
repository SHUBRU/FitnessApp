import React, { useState, useEffect } from "react";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { Link } from "react-router-dom"; // Import Link component
import BottomNav from "../Components/functions/BottomNav";
import QuickLinks from "../Components/functions/app/QuickLinks";
import TopSection from "../Components/functions/app/TopSection";
import QuickLinksBig1 from "../Components/functions/app/QuicklinksBig1";
import QuickLinksBig2 from "../Components/functions/app/QuicklinksBig2";
import QuickLinksBig3 from "../Components/functions/app/QuicklinksBig3";

function AppHome() {
  return (
    <div>
      <TopSection />
      <div className="pt-40 pb-24">
        <QuickLinks />
        <div className="flex justify-center items-center pt-10">
          <QuickLinksBig1 />
        </div>{" "}
        <div className="flex justify-center items-center pt-10">
          <QuickLinksBig2 />
        </div>{" "}
        <div className="flex justify-center items-center pt-10">
          <QuickLinksBig3 />
        </div>{" "}
      </div>
    </div>
  );
}

export default AppHome;
