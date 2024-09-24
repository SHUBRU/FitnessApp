import React from "react";
import { Link } from "react-router-dom";

function QuickLinks() {
  return (
    <div>
      <div className="flex overflow-x-auto space-x-4 px-2 py-4 scrollbar-hide">
        {/* Card 1 */}
        <Link to="/Progress">
          <div className="flex-none w-44 h-28 bg-gray-200 rounded-lg flex items-center justify-center text-black font-bold">
            Training Tracker
          </div>
        </Link>
        {/* Card 2 */}
        <div className="flex-none w-44 h-28 bg-gray-200 rounded-lg flex items-center justify-center text-black font-bold">
          Daily Cals
        </div>
        {/* Card 3 */}
        <Link to="/WeightTrackerPage">
          <div className="flex-none w-44 h-28 bg-gray-200 rounded-lg flex items-center justify-center text-black font-bold">
            Weight Tracker
          </div>
        </Link>
        {/* Card 4 */}
        <div className="flex-none w-44 h-28 bg-gray-200 rounded-lg flex items-center justify-center text-black font-bold">
          Music
        </div>
      </div>
    </div>
  );
}

export default QuickLinks;
