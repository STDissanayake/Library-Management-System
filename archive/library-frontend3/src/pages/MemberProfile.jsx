import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function MemberProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch member details
  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await api.get(`/members/${id}`);
        setMember(res.data);
      } catch (err) {
        setError("Failed to load member details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  const handleEdit = () => {
    navigate(`/members/edit/${id}`);
  };

  const handleBack = () => {
    navigate("/members");
  };

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

  if (loading) {
    return (
      <div className="dashboard">
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <span className="loading" style={{ width: '3rem', height: '3rem' }}></span>
          <p style={{ marginTop: '1rem', color: 'var(--gray)' }}>Loading member details...</p>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="dashboard">
        <div className="alert alert-error">
          <span>⚠️</span>
          <span>{error || "Member not found"}</span>
        </div>
        <button onClick={handleBack} className="btn btn-outline">
          ← Back to Members
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">👤 Member Profile</h1>
          <p className="dashboard-subtitle">
            Detailed information for {member.firstName} {member.lastName}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleBack} className="btn btn-outline">
            ← Back to Members
          </button>
          {user.role === "ADMIN" && (
            <button onClick={handleEdit} className="btn btn-primary">
              ✏️ Edit Member
            </button>
          )}
        </div>
      </div>

      {/* Member Info Cards */}
      <div className="grid grid-2">
        {/* Personal Information Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📋 Personal Information</h2>
            <span className="badge badge-staff">
              ID: {member.memberId}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                color: 'var(--gray)', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Full Name
              </label>
              <p style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                color: 'var(--dark)',
                margin: 0 
              }}>
                {member.firstName} {member.lastName}
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                color: 'var(--gray)', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                First Name
              </label>
              <p style={{ fontSize: '1rem', color: 'var(--dark)', margin: 0 }}>
                {member.firstName}
              </p>
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                color: 'var(--gray)', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Last Name
              </label>
              <p style={{ fontSize: '1rem', color: 'var(--dark)', margin: 0 }}>
                {member.lastName}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📞 Contact Information</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                color: 'var(--gray)', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Email Address
              </label>
              {member.email ? (
                <a 
                  href={`mailto:${member.email}`}
                  style={{ 
                    fontSize: '1rem', 
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>✉️</span>
                  <span>{member.email}</span>
                </a>
              ) : (
                <p style={{ fontSize: '1rem', color: 'var(--gray)', margin: 0, fontStyle: 'italic' }}>
                  No email provided
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                color: 'var(--gray)', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Phone Number
              </label>
              {member.phone ? (
                <a 
                  href={`tel:${member.phone}`}
                  style={{ 
                    fontSize: '1rem', 
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span>📱</span>
                  <span>{member.phone}</span>
                </a>
              ) : (
                <p style={{ fontSize: '1rem', color: 'var(--gray)', margin: 0, fontStyle: 'italic' }}>
                  No phone provided
                </p>
              )}
            </div>

            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.75rem', 
                textTransform: 'uppercase', 
                color: 'var(--gray)', 
                marginBottom: '0.5rem',
                fontWeight: '600',
                letterSpacing: '0.05em'
              }}>
                Address
              </label>
              {member.address ? (
                <p style={{ 
                  fontSize: '1rem', 
                  color: 'var(--dark)', 
                  margin: 0,
                  lineHeight: '1.6'
                }}>
                  📍 {member.address}
                </p>
              ) : (
                <p style={{ fontSize: '1rem', color: 'var(--gray)', margin: 0, fontStyle: 'italic' }}>
                  No address provided
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Card (Placeholder for future features) */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 Borrowing History</h2>
        </div>

        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <p className="empty-state-text">No borrowing history yet</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--gray)' }}>
            This member hasn't borrowed any books yet.
          </p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="grid grid-3">
        <div className="stat-card">
          <div className="stat-icon stat-icon-primary">
            <span>📚</span>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Books Borrowed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-warning">
            <span>📖</span>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Currently Borrowed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-success">
            <span>✅</span>
          </div>
          <div className="stat-content">
            <h3>0</h3>
            <p>Returned On Time</p>
          </div>
        </div>
      </div>

      {/* Admin-only Actions */}
      {user.role === "ADMIN" && (
        <div className="alert alert-info">
          <span>ℹ️</span>
          <div>
            <strong>Admin Actions</strong>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              As an admin, you can edit this member's information by clicking the "Edit Member" button above.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberProfile;