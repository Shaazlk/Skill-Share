import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

// Auth & Layout
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navigation from "./components/common/Navigation";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

// Home, Profile, Posts
import Home from "./components/home/Home";
import Profile from "./components/profile/Profile";
import EditProfile from "./components/profile/EditProfile";
import PostDetail from "./components/posts/PostDetail";
import Notifications from "./components/notifications/Notifications";


// Workout Plans
import WorkoutPlans from "./components/workoutplans/WorkoutPlans";
import WorkoutPlanDetail from "./components/workoutplans/WorkoutPlanDetail";
import CreateWorkoutPlan from "./components/workoutplans/CreateWorkoutPlan";
import EditWorkoutPlan from "./components/workoutplans/EditWorkoutPlan";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Home */}
              <Route path="/" element={<ProtectedRoute element={<Home />} />} />

              {/* Profile Routes */}
              <Route path="/profile/edit" element={<ProtectedRoute element={<EditProfile />} />} />
              <Route path="/profile/:id" element={<ProtectedRoute element={<Profile />} />} />

              {/* Post Detail */}
              <Route path="/post/:id" element={<ProtectedRoute element={<PostDetail />} />} />

              {/* Notifications */}
              <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />

           
              {/* Workout Plan Routes */}
              <Route path="/workoutplans" element={<ProtectedRoute element={<WorkoutPlans />} />} />
              <Route path="/workoutplans/create" element={<ProtectedRoute element={<CreateWorkoutPlan />} />} />
              <Route path="/workoutplans/edit/:id" element={<ProtectedRoute element={<EditWorkoutPlan />} />} />
              <Route path="/workoutplans/:id" element={<ProtectedRoute element={<WorkoutPlanDetail />} />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
