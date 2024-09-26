import { useEffect, useState } from 'react';
import { db } from './config/firebase'; // Import your Firebase config
import { auth } from './config/firebase';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Navbar from './Components/Navbar';
//Pages
import AppHome from './pages/AppHome';
import CalorieGoals from './pages/CalorieGoals';
import Competition from './pages/Competition';
import Training from './pages/Training';
import WeightProgress from './pages/WeightProgress';
import WorkoutTracker from './Components/WorkoutTracker';
import Home from './pages/Home';
import AdminPage from './pages/Admin_Pages/Home'
import AdminRoute1 from './pages/Admin_Pages/AdminRoute';
import Tracker from './pages/App/Tracker';
import Progress from './pages/App/Progress';
import BottomNav from './Components/functions/BottomNav';
import Workout from './pages/App/Workout';
import { getAuth } from 'firebase/auth';
import CustomWorkoutSelector from './pages/CustomWorkoutSelector';
import WorkoutAnalyserPAge from './pages/WorkoutAnalyserPage';
import Settings from './pages/Settings';
import RaschidWinningFormula from './pages/RaschidWinningFormula';
import WeightTrackerPage from './pages/WeightTrackerPage';
import Login from './Components/com/Login';
import ProgressGraph from './Components/functions/app/ProgressGraph';
import CompetitionPage from './Components/functions/app/CompetitionPage';



function AdminRoute({ path, component: Component, roles }) {
  if (roles.admin) {
    return <Route path={path} element={<Component />} />;
  }
  return null;
}

const App = () => {
  //For Handeling the Login:
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState({});
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (loggedInUser) => {
      if (loggedInUser) {
        try {
          if (db && db.collection) {
            const userDoc = await db.collection('users').doc(loggedInUser.uid).get();
            const userRoles = userDoc.data().roles || {};
            setRoles(userRoles);
            setUser(loggedInUser);
          } else {
            console.log('DB or DB Collection not initialized');
          }
        } catch (error) {
          console.log('An error occurred: ', error);
        }
      } else {
        setUser(null);
        setRoles({});
      }
      setLoading(false); // Set loading to false once everything is done
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or your custom loading spinner
  }


  return (
    <Router>
      <div>
        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CalorieGoals" element={<CalorieGoals />} />
          <Route path="/Competition" element={<Competition />} />
          <Route path="/Training" element={<Training />} />
          <Route path="/WeightProgress" element={<WeightProgress />} />
          <Route path="/TrainingProgress" element={<WorkoutTracker />} />
          <Route path="/dashboard" element={<AppHome />} />
          <Route path="/Tracker" element={<Tracker />} />
          <Route path="/Progress" element={<Progress />} />
          <Route path="/Workout" element={<Workout/>} />
          <Route path="/WorkoutAnalyser" element={<WorkoutAnalyserPAge/>} />
          <Route path="/Settings" element={<Settings/>} />
          <Route path="/RaschidWinningFormula" element={<RaschidWinningFormula/>} />
          <Route path="/WeightTrackerPage" element={<WeightTrackerPage/>} />

          <Route path="/" element={<CustomWorkoutSelector />} />
          <Route path="/workout-tracker/:workoutId" element={<WorkoutTracker />} />

          {/* No need for a default route, Home is the first route */}

          {user && <Route path="/app" element={<AppHome />} />}

          {AdminRoute({ path: "/admin", component: AdminPage, roles })}
        </Routes>
        <div className='absolute'>
          <BottomNav/>
        </div>

        
      </div>
    </Router>
  );
};

export default App;
