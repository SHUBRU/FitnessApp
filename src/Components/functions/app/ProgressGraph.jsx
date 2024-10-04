import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ProgressGraph = () => {
  const [mode, setMode] = useState("workout"); // 'workout' or 'exercise'
  const [workoutStats, setWorkoutStats] = useState([]);
  const [workoutNames, setWorkoutNames] = useState([]); // Store all workout names for filtering
  const [selectedWorkouts, setSelectedWorkouts] = useState([]); // Track selected workouts
  const [chartData, setChartData] = useState([]); // Data for the chart
  const [labels, setLabels] = useState([]); // Labels for the chart

  const auth = getAuth();
  const db = getFirestore();

  // Fetch all WorkoutStats and their respective data from Firestore
  useEffect(() => {
    const fetchWorkoutStats = async () => {
      const userId = auth.currentUser.uid;
      const workoutStatsRef = collection(db, 'Users', userId, 'WorkoutStats');
      const statsSnapshot = await getDocs(workoutStatsRef);
      
      let allWorkoutData = [];
      let workoutNamesSet = new Set();

      // Loop through each workout (e.g., 'Chest Day', 'Leg Day')
      for (let doc of statsSnapshot.docs) {
        const workoutName = doc.id; // The workout name
        const datesRef = collection(workoutStatsRef, workoutName, 'Dates'); // Fetch dates
        const datesSnapshot = await getDocs(datesRef);

        // Collect each date's points data for the workout
        datesSnapshot.forEach((dateDoc) => {
          const dateData = dateDoc.data();
          allWorkoutData.push({
            workoutName,
            points: dateData.Points,
            date: new Date(dateData.Timestamp).toLocaleDateString(),
          });
        });

        workoutNamesSet.add(workoutName);
      }

      setWorkoutStats(allWorkoutData);
      setWorkoutNames(Array.from(workoutNamesSet)); // Convert set to array
    };

    fetchWorkoutStats();
  }, [auth, db]);

  // Handle workout selection for filtering
  const handleWorkoutSelection = (workoutName) => {
    setSelectedWorkouts((prevWorkouts) =>
      prevWorkouts.includes(workoutName)
        ? prevWorkouts.filter((name) => name !== workoutName)
        : [...prevWorkouts, workoutName]
    );
  };

  // Update chart data whenever selected workouts change
  useEffect(() => {
    if (selectedWorkouts.length > 0) {
      const filteredStats = workoutStats.filter((stat) =>
        selectedWorkouts.includes(stat.workoutName)
      );

      // Extract labels (dates) and datasets (points)
      const timestamps = filteredStats.map((stat) => stat.date);
      setLabels(timestamps);

      const datasets = selectedWorkouts.map((workoutName, index) => {
        const workoutData = filteredStats
          .filter((stat) => stat.workoutName === workoutName)
          .map((stat) => stat.points);

        return {
          label: workoutName,
          data: workoutData,
          borderColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
            (index * 150) % 255
          }, 1)`,
          backgroundColor: `rgba(${(index * 50) % 255}, ${(index * 100) % 255}, ${
            (index * 150) % 255
          }, 0.2)`,
        };
      });

      setChartData(datasets);
    }
  }, [selectedWorkouts, workoutStats]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Workout Progress (Points)",
      },
    },
  };

  return (
    <div className="bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Progress Graph</h2>

      {/* Custom Workouts Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-2 text-gray-800">
          Select Workouts to View Progress:
        </h4>
        {workoutNames.map((workoutName) => (
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
          <p className="text-center text-gray-500">
            No data available. Please select workouts to view progress.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProgressGraph;
