import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const CustomWorkoutCreator = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [targetedMuscles, setTargetedMuscles] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [Exercises, setExercises] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get current user's ID

  // Fetch all available Exercises from the 'Exercises' collection
  useEffect(() => {
    const fetchExercises = async () => {
      const ExercisesSnapshot = await getDocs(collection(db, 'Exercises'));
      const ExercisesList = ExercisesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExercises(ExercisesList);
    };
    fetchExercises();
  }, [db]);

  // Handle targeted muscle checkbox selection
  const handleMuscleSelection = (muscle) => {
    if (targetedMuscles.includes(muscle)) {
      setTargetedMuscles(targetedMuscles.filter((m) => m !== muscle));
    } else {
      setTargetedMuscles([...targetedMuscles, muscle]);
    }
  };

  // Handle exercise checkbox selection
  const handleExerciseselection = (exerciseId) => {
    if (selectedExercises.includes(exerciseId)) {
      setSelectedExercises(selectedExercises.filter((id) => id !== exerciseId));
    } else {
      setSelectedExercises([...selectedExercises, exerciseId]);
    }
  };

  // Filter Exercises by selected muscle group
  const filteredExercises = muscleFilter
    ? Exercises.filter((exercise) => exercise.Muscle === muscleFilter)
    : Exercises;

  // Save workout to Firestore with workout name as document ID
  const saveWorkout = async () => {
    if (!workoutName || !targetedMuscles.length || !selectedExercises.length) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    try {
      const workoutData = {
        workoutName,
        musclesTargeted: targetedMuscles,
        Exercises: selectedExercises, // Store exercise IDs
      };

      if (userId) {
        const workoutDocRef = doc(db, 'Users', userId, 'Workout', workoutName); // Use workoutName as document ID
        await setDoc(workoutDocRef, workoutData); // Save workout data

        setSuccess('Workout saved successfully!');
        setWorkoutName('');
        setTargetedMuscles([]);
        setSelectedExercises([]);
      } else {
        setError('User not authenticated. Please log in.');
      }
    } catch (error) {
      setError('Failed to save workout: ' + error.message);
    }
  };

  return (
    <div className="p-6 pb-64">
      <h2 className="text-2xl font-bold mb-4">Create New Custom Workout</h2>

      {/* Workout Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Workout Name</label>
        <input
          type="text"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Enter workout name"
        />
      </div>

      {/* Muscle Group Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Filter by Muscle Group</label>
        <select
          value={muscleFilter}
          onChange={(e) => setMuscleFilter(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">All Muscles</option>
          <option value="Chest">Chest</option>
          <option value="Legs">Legs</option>
          <option value="Back">Back</option>
          <option value="Bicep">Biceps</option>
          <option value="Tricep">Triceps</option>
          <option value="Forearm">Forearm</option>
          <option value="Core">Core</option>

          {/* Add other muscle groups as needed */}
        </select>
      </div>

      {/* Available Exercises (with checkboxes) */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Select Exercises</h3>
        {filteredExercises.length === 0 ? (
          <p>No Exercises available for this muscle group.</p>
        ) : (
          filteredExercises.map((exercise) => (
            <div key={exercise.id} className="flex items-center">
              <input
                type="checkbox"
                value={exercise.id}
                onChange={() => handleExerciseselection(exercise.id)}
                checked={selectedExercises.includes(exercise.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="ml-2 text-sm text-gray-700">
                {exercise.Name} ({exercise.Muscle}) {/* Replace 'Name' and 'Muscle' with your actual field names */}
              </label>
            </div>
          ))
        )}
      </div>

      {/* Targeted Muscles Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Select Targeted Muscles</h3>
        {["Chest", "Legs", "Back", "Biceps", "Triceps"].map((muscle) => (
          <div key={muscle} className="flex items-center">
            <input
              type="checkbox"
              value={muscle}
              onChange={() => handleMuscleSelection(muscle)}
              checked={targetedMuscles.includes(muscle)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="ml-2 text-sm text-gray-700">{muscle}</label>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={saveWorkout}
        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded hover:bg-indigo-700"
      >
        Finish and Save Workout
      </button>

      {/* Error and Success Messages */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default CustomWorkoutCreator;
