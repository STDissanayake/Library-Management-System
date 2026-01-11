"use client"

import { useState, useEffect } from "react"
import "./UserManagement.css"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || (process.env.NODE_ENV === "development" ? "" : "http://localhost:8081")

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("username")

  const usersPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [])

  const getAdminHeaders = () => {
    return {
      "Content-Type": "application/json",
      "X-Role": "ADMIN"
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await fetch(`${API_BASE_URL}/api/auth/users`, {
        headers: getAdminHeaders()
      })

      if (!response.ok) {
        const text = await response.text()
        if (response.status === 403) {
          throw new Error("Access denied. Please login as ADMIN to view users.")
        }
        throw new Error(text || `Failed to load users (HTTP ${response.status})`)
      }

      const data = await response.json()
      setUsers(data || [])
      setTotalPages(Math.ceil((data?.length || 0) / usersPerPage))
    } catch (err) {
      console.error("Error fetching users:", err)
      setError(err?.message || "Failed to load users. Please check if backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleSort = (value) => {
    setSortBy(value)
    setCurrentPage(1)
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setShowAddModal(true)
  }

  const handleDelete = async (userId) => {
    console.log("[UserManagement] Delete clicked", userId)
    if (window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        if (userId == null) {
          alert("Failed to delete user: missing user id")
          return
        }

        const res = await fetch(`${API_BASE_URL}/api/auth/users/${userId}`, {
          method: "DELETE",
          headers: getAdminHeaders()
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Failed to delete user (HTTP ${res.status})`)
        }

        await fetchUsers()
        alert("User deleted successfully!")
      } catch (err) {
        console.error("Error deleting user:", err)
        alert("Failed to delete user: " + (err.message))
      }
    }
  }

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        const res = await fetch(`${API_BASE_URL}/api/auth/users/${editingUser.userId}`, {
          method: "PUT",
          headers: {
            ...getAdminHeaders()
          },
          body: JSON.stringify(userData)
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Failed to update user (HTTP ${res.status})`)
        }
        alert("User updated successfully!")
      } else {
        if ((userData.role || "").toString().toUpperCase() === "ADMIN") {
          alert("Admin users cannot be created from the UI. Please create ADMIN accounts manually.")
          return
        }

        const randomPart = String(Math.floor(Math.random() * 100000)).padStart(5, "0")
        const tempPassword = `Temp${randomPart}`

        const payload = {
          ...userData,
          role: "STAFF",
          status: "ACTIVE",
          password: tempPassword,
        }

        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: "POST",
          headers: getAdminHeaders(),
          body: JSON.stringify(payload)
        })

        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Failed to create user (HTTP ${res.status})`)
        }

        alert(`User created successfully! Temporary password: ${tempPassword}`)
      }
      await fetchUsers()
      setShowAddModal(false)
      setEditingUser(null)
    } catch (err) {
      console.error("Error saving user:", err)
      alert("Failed to save user: " + (err.message))
    }
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setShowAddModal(true)
  }

  const handleResetPassword = async (userId) => {
    if (window.confirm("Are you sure you want to reset this user's password? A new temporary password will be generated.")) {
      try {
        await fetch(`${API_BASE_URL}/api/auth/users/${userId}/reset-password`, {
          method: "POST",
          headers: getAdminHeaders()
        })
        alert("Password reset successfully! New temporary password has been sent to the user's email.")
      } catch (err) {
        console.error("Error resetting password:", err)
        alert("Failed to reset password: " + (err.message))
      }
    }
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    return (
      user.username.toLowerCase().includes(searchLower) ||
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === "username") return a.username.localeCompare(b.username)
    if (sortBy === "firstName") return a.firstName.localeCompare(b.firstName)
    if (sortBy === "lastName") return a.lastName.localeCompare(b.lastName)
    if (sortBy === "email") return a.email.localeCompare(b.email)
    if (sortBy === "role") return a.role.localeCompare(b.role)
    if (sortBy === "status") return a.status.localeCompare(b.status)
    return 0
  })

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  )

  if (loading) {
    return (
      <div className="user-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading users...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="user-management">
        <div className="error-container">
          <div className="error-icon"></div>
          <div className="error-content">
            <h3>Error Loading Users</h3>
            <p>{error}</p>
            <button onClick={fetchUsers} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="user-management lb-page">
      {/* Header */}
      <div className="users-header lb-page-header">
        <div className="header-left">
          <h1 className="lb-page-title">User Management</h1>
          <p>Manage library staff accounts and permissions</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => handleSort(e.target.value)} className="filter-select">
              <option value="username">Username</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="role">Role</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Users:</span>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Admins:</span>
          <span className="stat-value">{users.filter(u => u.role === "ADMIN").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Librarians:</span>
          <span className="stat-value">{users.filter(u => u.role === "LIBRARIAN").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Staff:</span>
          <span className="stat-value">{users.filter(u => u.role === "STAFF").length}</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="users-table-container lb-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  <div className="empty-content lb-empty">
                    <h4>No users found</h4>
                    <p>No users available.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.userId}>
                  <td className="user-id">{user.userId}</td>
                  <td className="username">{user.username}</td>
                  <td className="user-name">
                    <div className="name-container">
                      <span className="full-name">{user.firstName} {user.lastName}</span>
                    </div>
                  </td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-phone">{user.phone || user.phoneNumber || "N/A"}</td>
                  <td className="user-role">
                    <div className="role-badge">{user.role}</div>
                  </td>
                  <td className="user-status">
                    {(user.status || "").toString().toUpperCase()}
                  </td>
                  <td className="user-actions">
                    <div className="actions-row">
                      <button type="button" onClick={() => handleEdit(user)} className="btn btn-secondary">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(user.userId)} className="btn btn-danger">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-btn"
          >
            ← Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages} ({filteredUsers.length} users)
          </span>
          
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            Next →
          </button>
        </div>
      )}

      {/* User Modal */}
      {showAddModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}

// User Modal Component
const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "STAFF",
    status: user?.status || "ACTIVE"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? "Edit User" : "Create New User"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
                disabled={!!user} // Username cannot be changed after creation
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter phone number"
              />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="STAFF">Staff</option>
                <option value="LIBRARIAN">Librarian</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
          </div>

          {user && (
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {user ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserManagement
