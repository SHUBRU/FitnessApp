import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const CompetitionPage = () => {
  const [mode, setMode] = useState('workout'); // 'workout', 'exercise', or 'weight'
  const [exerciseMode, setExerciseMode] = useState('reps'); // 'reps', 'weights', or 'both'
  const [selectedSet, setSelectedSet] = useState('Set 1'); // Default to Set 1
  const [allUsers, setAllUsers] = useState([]); // Track all users for selection
  const [selectedUsers, setSelectedUsers] = useState([]); // Track selected users
  const [workoutStats, setWorkoutStats] = useState({});
  const [exerciseData, setExerciseData] = useState({});
  const [weightData, setWeightData] = useState({});
  const [labels, setLabels] = useState([]); // Labels for the chart (timestamps)
  const [datasets, setDatasets] = useState([]); // Data for the chart (Y-values)
  const [availableExercises, setAvailableExercises] = useState([]); // Store all exercises for filtering

  const db = getFirestore();
  const auth = getAuth();

  // Fetch All Users for Competition Page
  useEffect(() => {
    const fetchAllUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'Users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().Name,
      }));
      setAllUsers(users);
    };

    const fetchAvailableExercises = async () => {
      const exerciseSnapshot = await getDocs(collection(db, 'Excersies'));
      const exercises = exerciseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableExercises(exercises);
    };

    fetchAllUsers();
    fetchAvailableExercises();
  }, [db]);

// Fetch user data (Workouts, Exercises, Weight) for selected users
const fetchUserData = async (userId) => {
  const userWorkoutStats = await getDocs(collection(db, 'Users', userId, 'WorkoutStats'));
  const userExerciseData = await getDocs(collection(db, 'Users', userId, 'Tracker'));
  const userWeightData = await getDocs(collection(db, 'Users', userId, 'Weight_Tracker')); // Updated to Weight_Tracker

  const workoutStats = userWorkoutStats.docs.map(doc => ({
    workoutName: doc.id,
    percentage: doc.data().Percentage,
    timestamp: doc.data().Timestamp,
  }));

  const exercises = userExerciseData.docs.map(doc => {
    const exerciseSets = doc.data(); // This contains sets and their data
    return {
      exerciseId: doc.id,
      sets: Object.keys(exerciseSets).map(setKey => ({
        setName: setKey,
        ...exerciseSets[setKey], // Contains Reps, Weights, and Time
      })),
    };
  });

  const weights = userWeightData.docs.map(doc => ({
    date: doc.data().DateTracked ? doc.data().DateTracked : 'Unknown Date', // Use DateTracked field
    weight: doc.data().Weight,
  }));

  return { workoutStats, exercises, weights };
};



  // Trigger data fetch when selected users change
  useEffect(() => {
    if (selectedUsers.length > 0) {
      const fetchDataForAllUsers = async () => {
        const allWorkoutData = {};
        const allExerciseData = {};
        const allWeightData = {};
        const allLabels = new Set(); // Use a Set to avoid duplicates in labels

        const promises = selectedUsers.map(async (userId) => {
          const { workoutStats, exercises, weights } = await fetchUserData(userId);

          allWorkoutData[userId] = workoutStats;
          allExerciseData[userId] = exercises;
          allWeightData[userId] = weights;

          // Collect labels (timestamps) for X-axis
          workoutStats.forEach(stat => allLabels.add(new Date(stat.timestamp).toLocaleDateString()));
          weights.forEach(weight => allLabels.add(weight.date));

          // For exercise data, add timestamps
          exercises.forEach(exercise => {
            exercise.sets.forEach(set => allLabels.add(new Date(set.Time).toLocaleDateString()));
          });
        });

        await Promise.all(promises);
        setWorkoutStats(allWorkoutData);
        setExerciseData(allExerciseData);
        setWeightData(allWeightData);
        setLabels(Array.from(allLabels).sort()); // Sort labels for X-axis
      };

      fetchDataForAllUsers();
    }
  }, [selectedUsers]);

  // Prepare chart data based on the selected mode (workout, exercise, or weight)
  useEffect(() => {
    const prepareChartData = () => {
      const datasets = [];

      if (mode === 'workout') {
        Object.keys(workoutStats).forEach((userId, index) => {
          const userStats = workoutStats[userId];
          const data = labels.map(label => {
            const stat = userStats.find(stat => new Date(stat.timestamp).toLocaleDateString() === label);
            return stat ? stat.percentage : null; // Return percentage or null if no data
          });

          datasets.push({
            label: allUsers.find(user => user.id === userId)?.name || 'Unknown User',
            data,
            borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
            spanGaps: true, // Allow for gaps in the data
          });
        });
      } else if (mode === 'weight') {
        Object.keys(weightData).forEach((userId, index) => {
          const userWeights = weightData[userId];
          const data = labels.map(label => {
            const weight = userWeights.find(weightEntry => weightEntry.date === label);
            return weight ? weight.weight : null; // Return weight or null if no data
          });

          datasets.push({
            label: allUsers.find(user => user.id === userId)?.name || 'Unknown User',
            data,
            borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
            backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
            spanGaps: true, // Allow for gaps in the data
          });
        });
      } else if (mode === 'exercise') {
        Object.keys(exerciseData).forEach((userId, index) => {
          const userExercises = exerciseData[userId];
          const selectedExercise = userExercises.find(ex => ex.exerciseId === availableExercises[0]?.id); // Example: Select first exercise

          if (selectedExercise) {
            const data = labels.map(label => {
              const set = selectedExercise.sets.find(set => new Date(set.Time).toLocaleDateString() === label);
              return set ? (exerciseMode === 'reps' ? set.Reps : set.Weights) : null; // Return reps or weights
            });

            datasets.push({
              label: allUsers.find(user => user.id === userId)?.name || 'Unknown User',
              data,
              borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
              backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
              spanGaps: true, // Allow for gaps in the data
            });
          }
        });
      }

      setDatasets(datasets);
    };

    if (labels.length > 0) {
      prepareChartData();
    }
  }, [labels, workoutStats, weightData, exerciseData, mode, exerciseMode]);

  const handleUserSelection = (userId) => {
    setSelectedUsers(prevUsers =>
      prevUsers.includes(userId)
        ? prevUsers.filter(id => id !== userId)
        : [...prevUsers, userId]
    );
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setLabels([]); // Reset labels when changing mode
    setDatasets([]); // Reset datasets when changing mode
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: mode === 'workout' ? 'Workout Progress' : mode === 'weight' ? 'Weight Progress' : 'Exercise Progress',
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Competition Page</h2>

      {/* Mode Switch */}
      <div className="mb-6">
        <button
          onClick={() => handleModeChange('workout')}
          className={`mr-4 px-4 py-2 rounded-lg ${mode === 'workout' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Workout
        </button>
        <button
          onClick={() => handleModeChange('exercise')}
          className={`mr-4 px-4 py-2 rounded-lg ${mode === 'exercise' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Exercise
        </button>
        <button
          onClick={() => handleModeChange('weight')}
          className={`px-4 py-2 rounded-lg ${mode === 'weight' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Weight
        </button>
      </div>

      {/* User Selection */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-800">Select Users to View Progress:</h4>
        {allUsers.map(user => (
          <div key={user.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              value={user.id}
              onChange={() => handleUserSelection(user.id)}
              className="h-4 w-4 text-blue-500"
            />
            <label className="ml-2 text-gray-700">{user.name}</label>
          </div>
        ))}
      </div>

      {/* Exercise Mode Switch */}
      {mode === 'exercise' && (
        <div className="mb-6">
          <button onClick={() => setExerciseMode('reps')} className={`mr-4 px-4 py-2 rounded-lg ${exerciseMode === 'reps' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Reps</button>
          <button onClick={() => setExerciseMode('weights')} className={`mr-4 px-4 py-2 rounded-lg ${exerciseMode === 'weights' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Weights</button>
          <button onClick={() => setExerciseMode('both')} className={`px-4 py-2 rounded-lg ${exerciseMode === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Both</button>
        </div>
      )}

      {/* Line Chart */}
      <div className="rounded-lg shadow-lg p-4 bg-white">
        {labels.length > 0 && datasets.length > 0 ? (
          <Line
            data={{
              labels: labels,
              datasets: datasets,
            }}
            options={chartOptions}
          />
        ) : (
          <p className="text-center text-gray-500">No data available. Please select users to view progress.</p>
        )}
      </div>
    </div>
  );
};

export default CompetitionPage;
