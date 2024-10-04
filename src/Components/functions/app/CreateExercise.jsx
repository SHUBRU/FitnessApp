import React, { useState } from "react";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const WorkoutCreator = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state to disable button while saving
  const db = getFirestore();
  const auth = getAuth();

  const handleCreateExercise = async () => {
    setLoading(true);
    try {
      const exercisesRef = collection(db, "Exercises");
      const exercisesSnapshot = await getDocs(exercisesRef);

      // Find the highest ExerciseID
      let highestExerciseId = 0;
      exercisesSnapshot.forEach((doc) => {
        const exerciseId = parseInt(doc.id.replace("ExerciseID", ""), 10);
        if (exerciseId > highestExerciseId) {
          highestExerciseId = exerciseId;
        }
      });

      // Increment the ExerciseID by 1
      const newExerciseId = `ExerciseID${highestExerciseId + 1}`;

      // Get the logged-in user's name
      const user = auth.currentUser;
      const userRef = doc(db, "Users", user.uid);
      const userSnap = await getDocs(userRef);
      const userName = userSnap.exists() ? userSnap.data().Name : "Unknown User";

      // Save the new exercise
      await setDoc(doc(db, "Exercises", newExerciseId), {
        Name: exerciseName,
        Muscle: muscleGroup,
        UserCreated: userName,
      });

      alert(`Exercise ${exerciseName} created successfully with ID: ${newExerciseId}`);
      setExerciseName("");
      setMuscleGroup("");
    } catch (error) {
      console.error("Error creating exercise:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center mt-8">
      {!isCreating && (
        <button
          className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-4 py-2"
          onClick={() => setIsCreating(true)}
        >
          Create New Exercise
        </button>
      )}

      {isCreating && (
        <div className="mt-4 flex flex-col space-y-4">
          <input
            type="text"
            value={exerciseName}
            placeholder="Exercise Name"
            onChange={(e) => setExerciseName(e.target.value)}
            className="block border rounded-lg p-2 mb-2"
          />

          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            className="block border rounded-lg p-2 mb-2"
          >
            <option value="">Select Muscle Group</option>
            <option value="Legs">Legs</option>
            <option value="Arms">Arms</option>
            <option value="Back">Back</option>
            <option value="Chest">Chest</option>
            <option value="Shoulders">Shoulders</option>
            <option value="Abs">Abs</option>
          </select>

          <button
            className="text-white bg-green-500 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-bold rounded-lg text-sm px-4 py-2"
            onClick={handleCreateExercise}
            disabled={!exerciseName || !muscleGroup || loading} // Disable if input is invalid or while loading
          >
            {loading ? "Creating..." : "Submit Exercise"}
          </button>

          <button
            className="text-white bg-red-500 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-bold rounded-lg text-sm px-4 py-2"
            onClick={() => setIsCreating(false)} // Close the form
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutCreator;
