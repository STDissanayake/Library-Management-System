import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import MemberManagement from "./pages/MemberManagement";
import MemberProfile from "./pages/MemberProfile";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        {/* Show Navbar only when user is logged in */}
        {user && <Navbar />}

        <Routes>
          {/* Public route - Login */}
          <Route path="/" element={<Login />} />

          {/* Admin-only routes */}
          {user && user.role === "ADMIN" && (
            <>
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/members" element={<MemberManagement />} />
              <Route path="/members/:id" element={<MemberProfile />} /> {/* ✅ Add this */}
            </>
          )}

          {/* Staff routes */}
          {user && user.role === "STAFF" && (
            <>
              <Route path="/staff" element={<StaffDashboard />} />
              <Route path="/members" element={<MemberManagement />} />
              <Route path="/members/:id" element={<MemberProfile />} /> {/* ✅ Add this */}
            </>
          )}

          {/* Redirect unknown routes */}
          <Route
            path="*"
            element={
              user ? (
                <Navigate to={user.role === "ADMIN" ? "/admin" : "/staff"} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
