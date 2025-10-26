import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function MemberManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all members
  const fetchMembers = async () => {
    try {
      const res = await api.get("/members");
      setMembers(res.data);
    } catch (err) {
      console.error("Error fetching members:", err);
      setMessage({ 
        type: "error", 
        text: "Failed to fetch members: " + (err.response?.data || err.message) 
      });
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (editingMember) {
        // Update existing member
        await api.put(`/members/${editingMember.memberId}`, form);
        setMessage({ type: "success", text: "✅ Member updated successfully!" });
      } else {
        // Create new member
        await api.post("/members", form);
        setMessage({ type: "success", text: "✅ Member added successfully!" });
      }
      
      resetForm();
      fetchMembers();
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: "❌ " + (err.response?.data || "Operation failed") 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (member) => {
    setEditingMember(member);
    setForm({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || "",
      phone: member.phone || "",
      address: member.address || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = async (memberId) => {
    if (!window.confirm("Are you sure you want to delete this member?")) {
      return;
    }

    try {
      await api.delete(`/members/${memberId}`);
      setMessage({ type: "success", text: "✅ Member deleted successfully!" });
      fetchMembers();
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: "❌ Failed to delete member: " + (err.response?.data || err.message) 
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: ""
    });
    setEditingMember(null);
    setShowForm(false);
  };

  // Filter members by search term
  const filteredMembers = members.filter(member => 
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.phone && member.phone.includes(searchTerm))
  );

  if (!user) {
    return (
      <div className="dashboard">
        <div className="alert alert-error">
          <span>🚫</span>
          <span>Please log in to access this page.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">👥 Member Management</h1>
        <p className="dashboard-subtitle">
          Manage library members - Add, edit, or remove member records
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <span>👥</span>
          </div>
          <div className="stat-content">
            <h3>{members.length}</h3>
            <p>Total Members</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <span>✅</span>
          </div>
          <div className="stat-content">
            <h3>{members.filter(m => m.email).length}</h3>
            <p>With Email</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <span>📞</span>
          </div>
          <div className="stat-content">
            <h3>{members.filter(m => m.phone).length}</h3>
            <p>With Phone</p>
          </div>
        </div>
      </div>

      {/* Add Member Button - Only for ADMIN */}
      {!showForm && user.role === "ADMIN" && (
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          style={{ marginBottom: '1.5rem' }}
        >
          <span>➕</span>
          <span>Add New Member</span>
        </button>
      )}

      {/* Add/Edit Member Form - Only for ADMIN */}
      {showForm && user.role === "ADMIN" && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {editingMember ? "✏️ Edit Member" : "➕ Add New Member"}
            </h2>
            <button 
              onClick={resetForm}
              className="btn btn-outline btn-sm"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  placeholder="Enter first name"
                  className="form-input"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
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
                <label className="form-label">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                placeholder="Enter full address"
                className="form-input"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {message.text && (
              <div className={`alert alert-${message.type}`}>
                <span>{message.text}</span>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading"></span>
                    <span>{editingMember ? "Updating..." : "Adding..."}</span>
                  </>
                ) : (
                  <>
                    <span>{editingMember ? "💾" : "➕"}</span>
                    <span>{editingMember ? "Update Member" : "Add Member"}</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={resetForm}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Members List */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📋 All Members</h2>
          <div className="form-group" style={{ margin: 0, minWidth: '250px' }}>
            <input
              type="search"
              placeholder="🔍 Search members..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>
        </div>

        {filteredMembers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-text">
              {searchTerm ? "No members found matching your search" : "No members yet"}
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              {searchTerm ? "Try a different search term" : "Add your first member to get started"}
            </p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.memberId}>
                    <td>{member.memberId}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/members/${member.memberId}`)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--primary)',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                          fontWeight: '600',
                          fontSize: '1rem',
                          padding: 0
                        }}
                      >
                        {member.firstName} {member.lastName}
                      </button>
                    </td>
                    <td style={{ color: 'var(--gray)' }}>
                      {member.email || '-'}
                    </td>
                    <td style={{ color: 'var(--gray)' }}>
                      {member.phone || '-'}
                    </td>
                    <td style={{ color: 'var(--gray)', maxWidth: '200px' }}>
                      {member.address || '-'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {/* Only ADMIN can see edit/delete buttons */}
                        {user.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => handleEdit(member)}
                              className="btn btn-outline btn-sm"
                              title="Edit member"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(member.memberId)}
                              className="btn btn-danger btn-sm"
                              title="Delete member"
                            >
                              🗑️
                            </button>
                          </>
                        )}
                        {/* STAFF can only view */}
                        {user.role === "STAFF" && (
                          <button
                            onClick={() => navigate(`/members/${member.memberId}`)}
                            className="btn btn-primary btn-sm"
                            title="View profile"
                          >
                            👁️ View
                          </button>
                        )}
                      </div>
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

export default MemberManagement;