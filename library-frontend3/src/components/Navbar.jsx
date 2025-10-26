import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const goToMembers = () => {
    navigate("/members");
  };

  const goToDashboard = () => {
    if (user.role === "ADMIN") navigate("/admin");
    else navigate("/staff");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={goToDashboard} style={{ cursor: "pointer" }}>
        <span>📚</span>
        <span>Thalahena Public Library</span>
      </div>

      {user && (
        <div className="navbar-user">
          {/* 🔹 Role-based actions */}
          <div className="navbar-links">
            {/* Show Manage Members for both Admin & Staff */}
            <button onClick={goToMembers} className="btn btn-outline btn-sm">
              👥 Manage Members
            </button>

            {/* Show Register button only for Admins */}
            {user.role === "ADMIN" && (
              <button
                onClick={() => navigate("/register")}
                className="btn btn-primary btn-sm"
              >
                ➕ Register User
              </button>
            )}
          </div>

          {/* 🔹 User Info + Logout */}
          <div className="user-badge">
            <span style={{ marginRight: "0.5rem" }}>
              {user.role === "ADMIN" ? "👑" : "👨‍💼"}
            </span>
            <span style={{ fontWeight: "600" }}>
              {user.firstName} {user.lastName}
            </span>
            <span style={{ opacity: "0.7", marginLeft: "0.5rem" }}>
              ({user.role})
            </span>
          </div>

          <button onClick={handleLogout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
