import React from "react";

function DashboardNav() {
  return (
    <div>
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
          <Link to="/Training" className="text-gray-900 hover:text-blue-700">
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
          <Link to="/Workout" className="text-gray-900 hover:text-blue-700">
            Workout
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default DashboardNav;
