// CustomWorkoutSelector.jsx

import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const CustomWorkoutSelector = () => {
  const [workouts, setWorkouts] = useState([]);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const userId = auth.currentUser.uid;
      const workoutsCollection = collection(db, "Users", userId, "Workout");
      const workoutSnapshot = await getDocs(workoutsCollection);
      const workoutList = workoutSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setWorkouts(workoutList);
    };

    fetchWorkouts();
  }, [auth, db]);

  const handleWorkoutSelect = (workoutId) => {
    navigate(`/workout-tracker/${workoutId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Select a Workout</h2>
      {workouts.length === 0 ? (
        <p>No custom workouts found. Please create one first.</p>
      ) : (
        <ul className="space-y-4">
          {workouts.map((workout) => (
            <li
              key={workout.id}
              className="p-4 border rounded hover:bg-gray-100 cursor-pointer"
              onClick={() => handleWorkoutSelect(workout.id)}
            >
              <h3 className="text-xl font-semibold">{workout.workoutName}</h3>
              <p className="text-sm text-gray-600">
                Targeted Muscles: {(workout.musclesTargeted || []).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomWorkoutSelector;
