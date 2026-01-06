import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ 
    firstName: "",
    lastName: "",
    username: "", 
    password: "", 
    email: "",
    role: "STAFF" 
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [updatingUser, setUpdatingUser] = useState(null);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage({ 
        type: "error", 
        text: "Failed to fetch users: " + (err.response?.data || err.message) 
      });
    }
  };

  // Handle new staff registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.post("/auth/register", form);
      setMessage({ type: "success", text: "✅ User registered successfully!" });
      setForm({ 
        firstName: "",
        lastName: "",
        username: "", 
        password: "",
        email: "",
        role: "STAFF" 
      });
      fetchUsers();
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: "❌ " + (err.response?.data || "Failed to register user") 
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle user status (active/inactive)
  const toggleUserStatus = async (userId, currentStatus) => {
    setUpdatingUser(userId);
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`/auth/users/${userId}/status`, { status: newStatus });
      
      setMessage({ 
        type: "success", 
        text: `✅ User status updated to ${newStatus}` 
      });
      
      // Update local state
      setUsers(users.map(u => 
        u.userId === userId ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: "❌ " + (err.response?.data || "Failed to update user status") 
      });
    } finally {
      setUpdatingUser(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.role === "ADMIN").length;
  const staffCount = users.filter(u => u.role === "STAFF").length;
  const activeUsers = users.filter(u => u.status === "ACTIVE").length;
  const inactiveUsers = users.filter(u => u.status === "INACTIVE").length;

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="dashboard">
        <div className="alert alert-error">
          <span>🚫</span>
          <span>Access denied. Admins only.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">👑 Admin Dashboard</h1>
        <p className="dashboard-subtitle">
          Welcome back, {user.firstName}! Manage your library staff and system settings.
        </p>
      </div>

      {/* Navigation button to Member Management */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/members")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          👥 Manage Members
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-4">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <span>👥</span>
          </div>
          <div className="stat-content">
            <h3>{totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <span>👑</span>
          </div>
          <div className="stat-content">
            <h3>{adminCount}</h3>
            <p>Administrators</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <span>👨‍💼</span>
          </div>
          <div className="stat-content">
            <h3>{staffCount}</h3>
            <p>Staff Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-info">
            <span>✅</span>
          </div>
          <div className="stat-content">
            <h3>{activeUsers}/{inactiveUsers}</h3>
            <p>Active/Inactive</p>
          </div>
        </div>
      </div>

      {/* Register New Staff Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">➕ Register New Staff Member</h2>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input
                placeholder="Enter first name"
                className="form-input"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input
                placeholder="Enter last name"
                className="form-input"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                placeholder="Enter username"
                className="form-input"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Optional)</label>
              <input
                type="email"
                placeholder="Enter email address"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN" disabled>Admin (Database Only)</option>
              </select>
            </div>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <span>{message.text}</span>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading"></span>
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>➕</span>
                <span>Register Staff Member</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* All Users Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 All Users</h2>
          <span style={{ color: 'var(--gray)', fontSize: '0.875rem' }}>
            {totalUsers} total users ({activeUsers} active, {inactiveUsers} inactive)
          </span>
        </div>

        {users.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-text">No users found</p>
            <p style={{ fontSize: '0.875rem' }}>Register your first staff member above.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>
                      <strong>{u.firstName} {u.lastName}</strong>
                    </td>
                    <td>{u.username}</td>
                    <td style={{ color: 'var(--gray)' }}>
                      {u.email || '-'}
                    </td>
                    <td>
                      <span className={`badge badge-${u.role.toLowerCase()}`}>
                        {u.role === 'ADMIN' ? '👑 ' : '👨‍💼 '}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${u.status === 'ACTIVE' ? 'success' : 'error'}`}>
                        {u.status === 'ACTIVE' ? '✅ Active' : '❌ Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => toggleUserStatus(u.userId, u.status)}
                        disabled={updatingUser === u.userId || u.userId === user.userId}
                        className={`btn btn-sm ${
                          u.status === 'ACTIVE' ? 'btn-error' : 'btn-success'
                        }`}
                        title={u.userId === user.userId ? "Cannot deactivate your own account" : ""}
                      >
                        {updatingUser === u.userId ? (
                          <span className="loading"></span>
                        ) : u.status === 'ACTIVE' ? (
                          <>❌ Deactivate</>
                        ) : (
                          <>✅ Activate</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;