"use client"

import { useState, useEffect } from "react"
import MemberService from "../service/MemberService"
import "./MemberManagement.css"

const MemberManagement = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sortBy, setSortBy] = useState("firstName")

  const membersPerPage = 10

  const normalizeMember = (member) => {
    if (!member) return null

    const id = member.id ?? member.memberID ?? member.memberId
    const statusRaw = member.status ?? member.memberStatus ?? ""
    const status = typeof statusRaw === "string" ? statusRaw.toUpperCase() : statusRaw

    return {
      ...member,
      id,
      memberId: member.memberId ?? member.memberID ?? member.member_id,
      status,
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await MemberService.getAllMembers()

      const data = Array.isArray(response.data) ? response.data : []
      const normalized = data
        .map(normalizeMember)
        .filter((m) => m && m.id != null)

      setMembers(normalized)
      setTotalPages(Math.ceil((normalized.length || 0) / membersPerPage))
    } catch (err) {
      console.error("Error fetching members:", err)
      setError("Failed to load members. Please check if backend server is running.")
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

  const handleEdit = (member) => {
    setEditingMember(member)
    setShowAddModal(true)
  }

  const handleDelete = async (memberId) => {
    console.log("[MemberManagement] Delete clicked", memberId)
    if (window.confirm("Are you sure you want to delete this member? This action cannot be undone.")) {
      try {
        if (memberId == null) {
          alert("Failed to delete member: missing member id")
          return
        }

        await MemberService.deleteMember(memberId)
        await fetchMembers()
        alert("Member deleted successfully!")
      } catch (err) {
        console.error("Error deleting member:", err)
        const message =
          err?.response?.data?.message ||
          err?.response?.data ||
          err?.message ||
          "Unknown error"
        alert("Failed to delete member: " + message)
      }
    }
  }

  const handleSaveMember = async (memberData) => {
    try {
      if (editingMember) {
        await MemberService.updateMember(editingMember.id, memberData)
        alert("Member updated successfully!")
      } else {
        await MemberService.createMember(memberData)
        alert("Member registered successfully!")
      }
      await fetchMembers()
      setShowAddModal(false)
      setEditingMember(null)
    } catch (err) {
      console.error("Error saving member:", err)
      alert("Failed to save member: " + (err.response?.data?.message || err.message))
    }
  }

  const handleAddMember = () => {
    setEditingMember(null)
    setShowAddModal(true)
  }

  const handleUpdateStatus = async (memberId, newStatus) => {
    try {
      await MemberService.updateMemberStatus(memberId, newStatus)
      setMembers(members.map(member => 
        member.id === memberId ? { ...member, status: newStatus } : member
      ))
      alert("Member status updated successfully!")
    } catch (err) {
      console.error("Error updating member status:", err)
      alert("Failed to update member status: " + (err.response?.data?.message || err.message))
    }
  }

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase()
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.phone.toLowerCase().includes(searchLower) ||
      (member.memberId && member.memberId.toString().toLowerCase().includes(searchLower))
    )
  })

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === "firstName") return a.firstName.localeCompare(b.firstName)
    if (sortBy === "lastName") return a.lastName.localeCompare(b.lastName)
    if (sortBy === "email") return a.email.localeCompare(b.email)
    if (sortBy === "status") return a.status.localeCompare(b.status)
    if (sortBy === "registrationDate") {
      return new Date(a.registrationDate || 0) - new Date(b.registrationDate || 0)
    }
    return 0
  })

  const paginatedMembers = sortedMembers.slice(
    (currentPage - 1) * membersPerPage,
    currentPage * membersPerPage
  )

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "#27ae60"
      case "INACTIVE": return "#6c757d"
      case "SUSPENDED": return "#dc3545"
      default: return "#6c757d"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE": return "✅"
      case "INACTIVE": return "⏸️"
      case "SUSPENDED": return "🚫"
      default: return "❓"
    }
  }

  if (loading) {
    return (
      <div className="member-management">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading members...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="member-management">
        <div className="error-container">
          <div className="error-icon"></div>
          <div className="error-content">
            <h3>Error Loading Members</h3>
            <p>{error}</p>
            <button onClick={fetchMembers} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="member-management lb-page">
      {/* Header */}
      <div className="members-header lb-page-header">
        <div className="header-left">
          <h1 className="lb-page-title">Member Management</h1>
          <p>Manage library members and their accounts</p>
        </div>
        <div className="header-right">
          <button onClick={handleAddMember} className="btn btn-primary">
            + Register New Member
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search members by name, email, phone, or member ID..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
          <div className="search-icon"></div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => handleSort(e.target.value)} className="filter-select">
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="status">Status</option>
              <option value="registrationDate">Registration Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Total Members:</span>
          <span className="stat-value">{members.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active:</span>
          <span className="stat-value active">{members.filter(m => m.status === "ACTIVE").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Inactive:</span>
          <span className="stat-value inactive">{members.filter(m => m.status === "INACTIVE").length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Suspended:</span>
          <span className="stat-value suspended">{members.filter(m => m.status === "SUSPENDED").length}</span>
        </div>
      </div>

      {/* Members Table */}
      <div className="members-table-container lb-card">
        <table className="members-table">
          <thead>
            <tr>
              <th>Member ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Registration Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedMembers.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-state">
                  <div className="empty-content lb-empty">
                    <div className="empty-icon"></div>
                    <h4>No members found</h4>
                    <p>Get started by registering your first member.</p>
                    <button onClick={handleAddMember} className="add-first-member-btn">
                      Register First Member
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedMembers.map((member) => (
                <tr key={member.id}>
                  <td className="member-id">{member.memberId || `MEM${String(member.id).padStart(6, '0')}`}</td>
                  <td className="member-name">
                    <div className="name-container">
                      <span className="full-name">{member.firstName} {member.lastName}</span>
                    </div>
                  </td>
                  <td className="member-email">{member.email}</td>
                  <td className="member-phone">{member.phone}</td>
                  <td className="member-address">
                    <div className="address-text">{member.address}</div>
                  </td>
                  <td className="member-status">
                    <div className="status-badge">{member.status}</div>
                  </td>
                  <td className="registration-date">
                    {member.registrationDate ? new Date(member.registrationDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="member-actions">
                    <div className="actions-row">
                      <button type="button" onClick={() => handleEdit(member)} className="btn btn-secondary">
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(member.id)} className="btn btn-danger">
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
            Page {currentPage} of {totalPages} ({filteredMembers.length} members)
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

      {/* Member Modal */}
      {showAddModal && (
        <MemberModal
          member={editingMember}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveMember}
        />
      )}
    </div>
  )
}

// Member Modal Component
const MemberModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    address: member?.address || "",
    status: (typeof member?.status === "string" ? member.status.toUpperCase() : member?.status) || "ACTIVE"
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
          <h2>{member ? "Edit Member" : "Register New Member"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="member-form">
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
          </div>

          <div className="form-group">
            <label>Residential Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter residential address"
              rows="3"
            />
          </div>

          {member && (
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {member ? "Update Member" : "Register Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberManagement
