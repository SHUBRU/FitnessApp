import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const CustomWorkoutCreator = () => {
  const [workoutName, setWorkoutName] = useState('');
  const [targetedMuscles, setTargetedMuscles] = useState([]);
  const [selectedExcersies, setSelectedExcersies] = useState([]);
  const [Excersies, setExcersies] = useState([]);
  const [muscleFilter, setMuscleFilter] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const db = getFirestore();
  const auth = getAuth();
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get current user's ID

  // Fetch all available Excersies from the 'Excersies' collection
  useEffect(() => {
    const fetchExcersies = async () => {
      const ExcersiesSnapshot = await getDocs(collection(db, 'Excersies'));
      const ExcersiesList = ExcersiesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExcersies(ExcersiesList);
    };
    fetchExcersies();
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
  const handleExcersieselection = (exerciseId) => {
    if (selectedExcersies.includes(exerciseId)) {
      setSelectedExcersies(selectedExcersies.filter((id) => id !== exerciseId));
    } else {
      setSelectedExcersies([...selectedExcersies, exerciseId]);
    }
  };

  // Filter Excersies by selected muscle group
  const filteredExcersies = muscleFilter
    ? Excersies.filter((exercise) => exercise.Muscle === muscleFilter)
    : Excersies;

  // Save workout to Firestore with workout name as document ID
  const saveWorkout = async () => {
    if (!workoutName || !targetedMuscles.length || !selectedExcersies.length) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    try {
      const workoutData = {
        workoutName,
        musclesTargeted: targetedMuscles,
        Excersies: selectedExcersies, // Store exercise IDs
      };

      if (userId) {
        const workoutDocRef = doc(db, 'Users', userId, 'Workout', workoutName); // Use workoutName as document ID
        await setDoc(workoutDocRef, workoutData); // Save workout data

        setSuccess('Workout saved successfully!');
        setWorkoutName('');
        setTargetedMuscles([]);
        setSelectedExcersies([]);
      } else {
        setError('User not authenticated. Please log in.');
      }
    } catch (error) {
      setError('Failed to save workout: ' + error.message);
    }
  };

  return (
    <div className="p-6">
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

      {/* Available Excersies (with checkboxes) */}
      <div className="mb-4">
        <h3 className="text-lg font-medium">Select Excersies</h3>
        {filteredExcersies.length === 0 ? (
          <p>No Excersies available for this muscle group.</p>
        ) : (
          filteredExcersies.map((exercise) => (
            <div key={exercise.id} className="flex items-center">
              <input
                type="checkbox"
                value={exercise.id}
                onChange={() => handleExcersieselection(exercise.id)}
                checked={selectedExcersies.includes(exercise.id)}
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
