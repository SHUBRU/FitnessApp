import React, { useState, useEffect } from 'react';
import { getFirestore, doc, collection, getDocs, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const WorkoutAnalyser = ({ workoutId, workoutName, exerciseData, onClose }) => {
  const [analysisResult, setAnalysisResult] = useState({ betterExercises: 0, totalExercises: 0 });
  const [percentageImprovement, setPercentageImprovement] = useState(0);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const analyzeWorkout = async () => {
      const userId = auth.currentUser.uid;
      const workoutStatsRef = collection(db, 'Users', userId, 'WorkoutStats', workoutName);
      const lastWorkoutSnapshot = await getDocs(workoutStatsRef);
      let lastWorkout = null;

      // Find the latest workout to compare with
      lastWorkoutSnapshot.docs.forEach(doc => {
        if (!lastWorkout || doc.data().Timestamp > lastWorkout.Timestamp) {
          lastWorkout = doc.data();
        }
      });

      let betterExercises = 0;
      let totalExercises = Object.keys(exerciseData).length;

      // Compare current workout to the last workout
      Object.keys(exerciseData).forEach(exerciseId => {
        const currentSets = exerciseData[exerciseId].sets;
        const lastSets = lastWorkout ? lastWorkout[exerciseId]?.sets : null;

        // If there's no previous data, mark all exercises as better
        if (!lastSets) {
          betterExercises += 1;
        } else {
          // Compare sets: more weight or more reps with the same weight
          const didBetter = currentSets.some((currentSet, index) => {
            const lastSet = lastSets[index] || { weight: 0, reps: 0 };
            return (
              currentSet.weight > lastSet.weight || 
              (currentSet.weight === lastSet.weight && currentSet.reps > lastSet.reps)
            );
          });
          if (didBetter) betterExercises += 1;
        }
      });

      // Calculate percentage improvement
      const improvement = (betterExercises / totalExercises) * 100;
      setAnalysisResult({ betterExercises, totalExercises });
      setPercentageImprovement(improvement.toFixed(2));

      // Save the analysis result in Firestore
      const timestamp = new Date().toISOString();
      const workoutStatsDocRef = doc(db, 'Users', userId, 'WorkoutStats', workoutName, timestamp);
      await setDoc(workoutStatsDocRef, {
        Timestamp: timestamp,
        Percentage: improvement.toFixed(2),
        ...exerciseData, // Save the current workout data for future comparisons
      });
    };

    analyzeWorkout();
  }, [auth, db, workoutId, workoutName, exerciseData]);

  const handleContinue = () => {
    navigate('/'); // Navigate back to the main workout selector
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Workout Analysis</h2>
        <p className="mb-4">
          {analysisResult.betterExercises}/{analysisResult.totalExercises} Exercises you did better.
        </p>
        <div className="w-full bg-gray-300 rounded-full h-4 mb-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${percentageImprovement}%` }}
          ></div>
        </div>
        <p className="text-center mb-6">{percentageImprovement}% of exercises improved</p>
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
          <button
            onClick={handleContinue}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutAnalyser;
