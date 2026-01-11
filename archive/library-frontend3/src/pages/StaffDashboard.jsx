import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function StaffDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="dashboard">
        <div className="alert alert-error">
          <span>🚫</span>
          <span>Please log in to access the dashboard.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">👨‍💼 Staff Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {user.firstName} {user.lastName}! Ready to manage the library?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <span>📚</span>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Books Available</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <span>📖</span>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Books Borrowed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <span>✅</span>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Returns Today</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">⚡ Quick Actions</h2>
        </div>

        <div className="grid grid-2">
          <button 
            onClick={() => navigate("/members")}
            className="btn btn-primary" 
            style={{ justifyContent: 'flex-start' }}
          >
            <span>👥</span>
            <span>Manage Members</span>
          </button>

          <button className="btn btn-success" style={{ justifyContent: 'flex-start' }}>
            <span>📖</span>
            <span>Issue Book</span>
          </button>

          <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <span>🔍</span>
            <span>Search Books</span>
          </button>

          <button className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
            <span>📊</span>
            <span>View Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 Recent Activity</h2>
        </div>

        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-text">No recent activity</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
            Book management features will be available soon.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div className="alert alert-info">
        <span>ℹ️</span>
        <div>
          <strong>Staff Dashboard</strong>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
            This is your staff workspace. Book management features are coming soon!
          </p>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;