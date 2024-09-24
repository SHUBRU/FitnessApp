import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ProgressGraph = () => {
  const [mode, setMode] = useState('workout'); // 'workout' or 'exercise'
  const [exerciseMode, setExerciseMode] = useState('reps'); // 'reps', 'weights', or 'both'
  const [selectedSet, setSelectedSet] = useState('Set 1'); // Default to Set 1
  const [workoutStats, setWorkoutStats] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState([]); // Track selected exercises
  const [selectedWorkouts, setSelectedWorkouts] = useState([]); // Track selected workouts
  const [repsData, setRepsData] = useState([]);
  const [weightsData, setWeightsData] = useState([]);
  const [labels, setLabels] = useState([]); // Labels for the chart
  const [workoutNames, setWorkoutNames] = useState([]); // Store all workout names for filtering
  const [exerciseLabels, setExerciseLabels] = useState([]); // Labels for exercises
  const [exerciseRepsData, setExerciseRepsData] = useState([]); // Reps data for exercises
  const [exerciseWeightsData, setExerciseWeightsData] = useState([]); // Weights data for exercises
  const [showDropdowns, setShowDropdowns] = useState({}); // Track dropdown open state for each muscle group
  const [chartData, setChartData] = useState([]); // Data for the chart

  const auth = getAuth();
  const db = getFirestore();

  // Fetch WorkoutStats and Exercises data from Firestore
  useEffect(() => {
    const fetchWorkoutStats = async () => {
      const userId = auth.currentUser.uid;
      const statsSnapshot = await getDocs(collection(db, 'Users', userId, 'WorkoutStats'));
      const stats = statsSnapshot.docs.map(doc => ({
        ...doc.data(),
        workoutName: doc.id,
      }));
      setWorkoutStats(stats);

      // Extract workout names for filtering
      const workoutNames = stats.map(stat => stat.workoutName);
      setWorkoutNames(workoutNames);
    };

    const fetchAvailableExercises = async () => {
      const exerciseSnapshot = await getDocs(collection(db, 'Excersies'));
      const exercises = exerciseSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableExercises(exercises);
    };

    fetchWorkoutStats();
    fetchAvailableExercises();
  }, [auth, db]);

  // Fetch exercise data for the selected exercise and set
  const fetchExerciseData = async (exerciseId) => {
    const userId = auth.currentUser.uid;
    const setRef = collection(db, 'Users', userId, 'Tracker', exerciseId, selectedSet);
    const setSnapshot = await getDocs(setRef);

    const fetchedRepsData = [];
    const fetchedWeightsData = [];
    const fetchedLabels = [];

    setSnapshot.forEach(doc => {
      const setData = doc.data();
      fetchedRepsData.push(parseInt(setData.Reps, 10) || 0);
      fetchedWeightsData.push(parseInt(setData.Weights, 10) || 0);
      fetchedLabels.push(new Date(setData.Time).toLocaleDateString());
    });

    setExerciseRepsData(fetchedRepsData);
    setExerciseWeightsData(fetchedWeightsData);
    setExerciseLabels(fetchedLabels);
  };

  // Trigger data fetch when selected set or exercises change
  useEffect(() => {
    if (mode === 'exercise' && selectedExercises.length > 0) {
      const promises = selectedExercises.map(exerciseId => fetchExerciseData(exerciseId));
      Promise.all(promises).then(() => {
        // Ensure chart gets updated after all exercise data is fetched
        updateChartData();
      });
    }
  }, [selectedSet, selectedExercises, mode]);

  const updateChartData = () => {
    if (mode === 'exercise' && selectedExercises.length > 0) {
      let datasets = [];

      if (exerciseMode === 'reps' || exerciseMode === 'both') {
        datasets.push({
          label: 'Reps',
          data: exerciseRepsData,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
        });
      }

      if (exerciseMode === 'weights' || exerciseMode === 'both') {
        datasets.push({
          label: 'Weights',
          data: exerciseWeightsData,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
        });
      }

      setChartData(datasets);
      setLabels(exerciseLabels); // Use exercise labels for x-axis
    }
  };

  // Handle workout selection for filtering
  const handleWorkoutSelection = (workoutName) => {
    setSelectedWorkouts(prevWorkouts =>
      prevWorkouts.includes(workoutName)
        ? prevWorkouts.filter(name => name !== workoutName)
        : [...prevWorkouts, workoutName]
    );
  };

  // Fetch data for the selected workouts and update the chart
  useEffect(() => {
    if (mode === 'workout' && selectedWorkouts.length > 0) {
      const filteredStats = workoutStats.filter(stat => selectedWorkouts.includes(stat.workoutName));
      
      const timestamps = filteredStats.map(stat => new Date(stat.Timestamp).toLocaleDateString());
      setLabels(timestamps);

      const datasets = filteredStats.map((stat, index) => ({
        label: stat.workoutName,
        data: [stat.Percentage], // Assuming only one data point per workout
        borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 1)`,
        backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${(index * 150) % 255}, 0.2)`,
      }));

      setChartData(datasets);
    }
  }, [selectedWorkouts, workoutStats, mode]);

  const handleExerciseSelection = (exerciseId) => {
    setSelectedExercises(prevExercises =>
      prevExercises.includes(exerciseId)
        ? prevExercises.filter(id => id !== exerciseId)
        : [...prevExercises, exerciseId]
    );
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setLabels([]); // Reset labels when changing mode
    setChartData([]); // Reset chart data
  };

  const handleSetChange = (setName) => {
    setSelectedSet(setName); // Change the selected set
  };

  const handleExerciseModeChange = (newMode) => {
    setExerciseMode(newMode); // Toggle between reps/weights/both
    updateChartData(); // Update chart immediately after changing exercise mode
  };

  const toggleDropdown = (muscleGroup) => {
    setShowDropdowns(prev => ({
      ...prev,
      [muscleGroup]: !prev[muscleGroup],
    }));
  };

  const groupedExercises = availableExercises.reduce((acc, exercise) => {
    const group = exercise.Muscle;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(exercise);
    return acc;
  }, {});

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: mode === 'workout' ? 'Workout Progress' : 'Exercise Progress',
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Progress Graph</h2>

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
          className={`px-4 py-2 rounded-lg ${mode === 'exercise' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Exercise
        </button>
      </div>

      {/* Set Selection Buttons */}
      {mode === 'exercise' && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-800">Select Set:</h4>
          <button onClick={() => handleSetChange('Set 1')} className={`mr-2 px-4 py-2 rounded-lg ${selectedSet === 'Set 1' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Set 1</button>
          <button onClick={() => handleSetChange('Set 2')} className={`mr-2 px-4 py-2 rounded-lg ${selectedSet === 'Set 2' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Set 2</button>
          <button onClick={() => handleSetChange('Set 3')} className={`px-4 py-2 rounded-lg ${selectedSet === 'Set 3' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Set 3</button>
        </div>
      )}

      {/* Custom Workouts Filter */}
      {mode === 'workout' && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2 text-gray-800">Select Workouts to View Progress:</h4>
          {workoutNames.map(workoutName => (
            <div key={workoutName} className="flex items-center mb-2">
              <input
                type="checkbox"
                value={workoutName}
                onChange={() => handleWorkoutSelection(workoutName)}
                className="h-4 w-4 text-blue-500"
              />
              <label className="ml-2 text-gray-700">{workoutName}</label>
            </div>
          ))}
        </div>
      )}

      {/* Exercise Dropdowns in two-column grid for mobile */}
      {mode === 'exercise' && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          {Object.keys(groupedExercises).map((muscleGroup) => (
            <div key={muscleGroup}>
              <button
                className="w-full text-left bg-gray-200 px-4 py-2 rounded-lg font-semibold text-gray-700"
                onClick={() => toggleDropdown(muscleGroup)}
              >
                {muscleGroup}
              </button>
              {showDropdowns[muscleGroup] && (
                <div className="ml-4 mt-2 space-y-2">
                  {groupedExercises[muscleGroup].map(exercise => (
                    <div key={exercise.id} className="flex items-center">
                      <input
                        type="checkbox"
                        value={exercise.id}
                        onChange={() => handleExerciseSelection(exercise.id)}
                        className="h-4 w-4 text-blue-500"
                      />
                      <label className="ml-2 text-gray-700">{exercise.Name}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Exercise Mode Switch */}
      {mode === 'exercise' && (
        <div className="mb-6">
          <button onClick={() => handleExerciseModeChange('reps')} className={`mr-4 px-4 py-2 rounded-lg ${exerciseMode === 'reps' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Reps</button>
          <button onClick={() => handleExerciseModeChange('weights')} className={`mr-4 px-4 py-2 rounded-lg ${exerciseMode === 'weights' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Weights</button>
          <button onClick={() => handleExerciseModeChange('both')} className={`px-4 py-2 rounded-lg ${exerciseMode === 'both' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Both</button>
        </div>
      )}

      {/* Line Chart */}
      <div className="rounded-lg shadow-lg p-4 bg-white">
        {labels.length > 0 && chartData.length > 0 ? (
          <Line
            data={{
              labels: labels,
              datasets: chartData,
            }}
            options={chartOptions}
          />
        ) : (
          <p className="text-center text-gray-500">No data available. Please select workouts or exercises to view progress.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressGraph;
