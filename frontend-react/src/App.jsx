import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GoalForm from "./pages/GoalForm";
import Goals from "./pages/Goals"; 
import SipGoals from "./pages/SipGoals"; 
import LumpSumGoalDetail from "./pages/LumpSumGoalDetail";
import SipGoalDetail from "./pages/SipGoalDetail";
import Profile from "./pages/Profile";
import SipCalculator from "./pages/SipCalculator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/goal"
          element={
            <ProtectedRoute>
              <GoalForm />
            </ProtectedRoute>
          }
        />
 <Route
          path="/sip-calculator"
          element={
            <ProtectedRoute>
              <SipCalculator />
            </ProtectedRoute>
          }
        />

 <Route
          path="/goals/lumpsum/chart/:id"
          element={
            <ProtectedRoute>
              <LumpSumGoalDetail />
            </ProtectedRoute>
          }
        />

         <Route
          path="/goals/sip/chart/:id"
          element={
            <ProtectedRoute>
              <SipGoalDetail />
            </ProtectedRoute>
          }
        />


 <Route
          path="/sip-goals"
          element={
            <ProtectedRoute>
              <SipGoals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lumpsum-goals"
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          }
        />


         <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
