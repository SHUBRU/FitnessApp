import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDocs, collection, setDoc, query, orderBy, limit, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';

const WorkoutTracker = () => {
  const [workout, setWorkout] = useState(null);
  const [exerciseData, setExerciseData] = useState({});
  const [availableExercises, setAvailableExercises] = useState([]);
  const [mode, setMode] = useState('last'); // 'last' or 'best'
  const auth = getAuth();
  const db = getFirestore();
  const { workoutId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkout = async () => {
      const userId = auth.currentUser.uid;
      const workoutRef = doc(db, 'Users', userId, 'Workout', workoutId);
      const workoutSnap = await getDoc(workoutRef);

      if (workoutSnap.exists()) {
        const workoutData = workoutSnap.data();
        setWorkout(workoutData);

        const initialExerciseData = {};
        for (const exerciseId of workoutData.Excersies) {
          const storedData = sessionStorage.getItem(`${workoutId}-${exerciseId}`);

          // Fetch last and best session data from Firestore
          const lastSessionData = await fetchSessionData(userId, exerciseId, 'last');
          const bestSessionData = await fetchSessionData(userId, exerciseId, 'best');

          // Log the fetched data for first exercise (Bench Press)
          if (exerciseId === workoutData.Excersies[0]) {
            console.log("Fetched data for Bench Press (first exercise):", {
              lastSessionData,
              bestSessionData
            });
          }

          // Populate data with fetched values for each set
          initialExerciseData[exerciseId] = storedData
            ? JSON.parse(storedData)
            : {
                sets: Array(3).fill(null).map((_, setIndex) => ({
                  weight: '',
                  reps: '',
                  lastReps: lastSessionData[setIndex]?.Reps || 0,
                  lastWeight: lastSessionData[setIndex]?.Weights || 0,
                  bestReps: bestSessionData[setIndex]?.Reps || 0,
                  bestWeight: bestSessionData[setIndex]?.Weights || 0,
                })),
              };
        }

        setExerciseData(initialExerciseData);
      }
    };

    const fetchAvailableExercises = async () => {
      const exercisesSnapshot = await getDocs(collection(db, 'Excersies'));
      const exercisesList = exercisesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailableExercises(exercisesList);
    };

    fetchWorkout();
    fetchAvailableExercises();
  }, [auth, db, workoutId]);

  // Fetch session data for all sets in a given mode (either 'last' or 'best')
  const fetchSessionData = async (userId, exerciseId, mode) => {
    const setsData = [];
    for (let i = 1; i <= 3; i++) {
      const trackerRef = collection(db, 'Users', userId, 'Tracker', exerciseId, `Set ${i}`);
      let sessionQuery;

      if (mode === 'last') {
        sessionQuery = query(trackerRef, orderBy('Time', 'desc'), limit(1));
      } else if (mode === 'best') {
        sessionQuery = query(trackerRef, orderBy('Weights', 'desc'), limit(1));
      }

      const sessionSnap = await getDocs(sessionQuery);

      if (!sessionSnap.empty) {
        const sessionData = sessionSnap.docs[0].data();
        setsData.push({ Reps: sessionData.Reps || 0, Weights: sessionData.Weights || 0 });
      } else {
        // If no data exists for the set, return 0
        setsData.push({ Reps: 0, Weights: 0 });
      }
    }
    return setsData;
  };

  const handleSetChange = (exerciseId, setIndex, field, value) => {
    setExerciseData(prevData => {
      const updatedSets = [...prevData[exerciseId].sets];
      updatedSets[setIndex] = { ...updatedSets[setIndex], [field]: value };

      const updatedExerciseData = {
        ...prevData,
        [exerciseId]: {
          ...prevData[exerciseId],
          sets: updatedSets,
        },
      };
      sessionStorage.setItem(`${workoutId}-${exerciseId}`, JSON.stringify(updatedExerciseData[exerciseId]));

      return updatedExerciseData;
    });
  };

  const addSet = (exerciseId) => {
    setExerciseData(prevData => {
      const updatedSets = [...prevData[exerciseId].sets, { weight: '', reps: '', lastReps: 0, lastWeight: 0, bestWeight: 0, bestReps: 0 }];
      const updatedExerciseData = {
        ...prevData,
        [exerciseId]: {
          ...prevData[exerciseId],
          sets: updatedSets,
        },
      };

      sessionStorage.setItem(`${workoutId}-${exerciseId}`, JSON.stringify(updatedExerciseData[exerciseId]));

      return updatedExerciseData;
    });
  };

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'last' ? 'best' : 'last'));
  };

  const handleFinishWorkout = async () => {
    const userId = auth.currentUser.uid;
    const timestamp = new Date().toISOString();
    let betterThanBestCount = 0;
    let total = 0;

    for (const exerciseId of Object.keys(exerciseData)) {
      const exerciseRef = doc(db, 'Users', userId, 'Tracker', exerciseId);

      exerciseData[exerciseId].sets.forEach(async (set, index) => {
        total++;
        if (set.reps !== '' || set.weight !== '') {
          const setRef = collection(exerciseRef, `Set ${index + 1}`);

          const setData = {
            Time: timestamp,
            Reps: set.reps,
            Weights: set.weight,
          };

          if (set.weight > set.bestWeight || (set.weight === set.bestWeight && set.reps > set.bestReps)) {
            betterThanBestCount++;
          }

          await setDoc(doc(setRef), setData);
        }
      });

      sessionStorage.removeItem(`${workoutId}-${exerciseId}`);
    }

    const percentageBetter = Math.round((betterThanBestCount / total) * 100);

    // Correct Firestore reference with an even number of segments
    const workoutStatsRef = doc(db, 'Users', userId, 'WorkoutStats', workout.workoutName);

    // Now we store the timestamp and percentage inside the document
    await setDoc(workoutStatsRef, {
      Timestamp: timestamp,
      Percentage: percentageBetter
    });

    alert(`${betterThanBestCount}/${total} sets were better than your best!`);
    navigate('/');
  };

  if (!workout) {
    return <p>Loading workout...</p>;
  }

  return (
    <div className="p-6 pb-32">
      <h2 className="text-2xl font-bold mb-4">{workout.workoutName}</h2>

      {/* Toggle Switch for Last Time/Best Time */}
      <div className="flex items-center mb-4">
        <span className="mr-4">Last Time</span>
        <label className="switch">
          <input type="checkbox" checked={mode === 'best'} onChange={toggleMode} />
          <span className="slider"></span>
        </label>
        <span className="ml-4">Best Time</span>
      </div>

      <div className="space-y-6">
        {Object.keys(exerciseData).map((exerciseId) => {
          const exercise = availableExercises.find(ex => ex.id === exerciseId);
          if (!exercise) return null;

          const exerciseInfo = exerciseData[exerciseId];
          return (
            <div key={exerciseId} className="border p-4 rounded">
              <details>
                <summary className="font-semibold">
                  {exercise.Name} ({exercise.Muscle})
                </summary>
                <div className="mt-4 space-y-4">
                  {exerciseInfo.sets.map((set, index) => (
                    <div key={index} className="flex space-x-4 items-center">
                      <span>Set {index + 1}</span>
                      <input
                        type="number"
                        placeholder={mode === 'last' ? `${set.lastWeight || 0}` : `${set.bestWeight || 0}`}
                        value={set.weight}
                        onChange={e => handleSetChange(exerciseId, index, 'weight', e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                      <input
                        type="number"
                        placeholder={mode === 'last' ? `${set.lastReps || 0}` : `${set.bestReps || 0}`}
                        value={set.reps}
                        onChange={e => handleSetChange(exerciseId, index, 'reps', e.target.value)}
                        className="w-24 px-2 py-1 border rounded"
                      />
                    </div>
                  ))}
                  <button
                    onClick={() => addSet(exerciseId)}
                    className="mt-2 text-indigo-600"
                  >
                    + Add Set
                  </button>
                </div>
              </details>
            </div>
          );
        })}

        {/* Finish Workout Button */}
        <button
          onClick={handleFinishWorkout}
          className="w-full bg-green-600 text-white px-4 py-2 rounded mt-4"
        >
          Finish Workout
        </button>
      </div>
    </div>
  );
};

export default WorkoutTracker;
