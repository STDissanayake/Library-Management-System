"use client"

import { useState, useEffect } from "react"
import MemberService from "../service/MemberService"
import "./MembersList.css"

const MembersList = () => {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const response = await MemberService.getAllMembers()
      setMembers(response.data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching members:", err)
      setError("Failed to load members. Please check if the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  // Search members
  useEffect(() => {
    const searchMembers = async () => {
      try {
        setLoading(true)
        let membersData = []

        if (searchTerm.trim()) {
          const response = await MemberService.searchMembers(searchTerm)
          membersData = response.data || []
        } else {
          const response = await MemberService.getAllMembers()
          membersData = response.data || []
        }

        setMembers(membersData)
        setError(null)
      } catch (err) {
        console.error("Error in search:", err)
        setError("Search failed. Showing all members.")
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchMembers, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleEdit = (member) => {
    setEditingMember(member)
    setShowAddModal(true)
  }

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await MemberService.deleteMember(memberId)
        setMembers(members.filter((member) => member.id !== memberId))
        alert("Member deleted successfully!")
      } catch (err) {
        console.error("Error deleting member:", err)
        alert("Failed to delete member: " + (err.response?.data?.message || err.message))
      }
    }
  }

  const handleAddMember = () => {
    setEditingMember(null)
    setShowAddModal(true)
  }

  const handleSaveMember = async (memberData) => {
    try {
      if (editingMember) {
        await MemberService.updateMember(editingMember.id, memberData)
        alert("Member updated successfully!")
      } else {
        await MemberService.createMember(memberData)
        alert("Member added successfully!")
      }
      fetchMembers()
      setShowAddModal(false)
      setEditingMember(null)
    } catch (err) {
      console.error("Error saving member:", err)
      alert("Failed to save member: " + (err.response?.data?.message || err.message))
    }
  }

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "status-active"
      case "INACTIVE":
        return "status-inactive"
      case "SUSPENDED":
        return "status-suspended"
      default:
        return "status-unknown"
    }
  }

  if (loading) return <div className="loading">Loading members...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="members-container">
      <div className="members-header">
        <h1>👥 Members ({members.length})</h1>
        <button className="btn btn-secondary" onClick={handleAddMember}>
          + Add New Member
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search members by name, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="fas fa-search search-icon"></i>
      </div>

      <div className="members-grid">
        {members.map((member) => (
          <div key={member.id} className="member-card">
            <div className="member-header">
              <h3>{member.firstName} {member.lastName}</h3>
              <span className={`status-badge ${getStatusClass(member.status)}`}>
                {member.status || "UNKNOWN"}
              </span>
            </div>
            
            <div className="member-details">
              <div className="detail-item">
                <i className="fas fa-envelope"></i>
                <span>{member.email}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-phone"></i>
                <span>{member.phone || "N/A"}</span>
              </div>
              <div className="detail-item">
                <i className="fas fa-home"></i>
                <span>{member.address || "N/A"}</span>
              </div>
            </div>

            <div className="member-actions">
              <button className="btn btn-edit" onClick={() => handleEdit(member)}>
                <i className="fas fa-edit"></i> Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(member.id)}>
                <i className="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && !loading && (
        <div className="no-members">
          <i className="fas fa-users"></i>
          <h3>No members found</h3>
          <p>Start by adding your first member to the library system.</p>
        </div>
      )}

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

// Simple Member Modal Component
const MemberModal = ({ member, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: member?.firstName || "",
    lastName: member?.lastName || "",
    email: member?.email || "",
    phone: member?.phone || "",
    address: member?.address || "",
    status: member?.status || "ACTIVE"
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
          <h2>{member ? "Edit Member" : "Add New Member"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="member-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {member ? "Update" : "Save"} Member
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MembersList
