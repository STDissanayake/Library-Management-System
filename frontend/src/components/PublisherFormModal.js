"use client"

import { useState, useEffect } from "react"
import "./PublisherFormModal.css"

const PublisherFormModal = ({ publisher, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contactInfo: ""
  })

  useEffect(() => {
    if (publisher) {
      setFormData({
        name: publisher.name || "",
        address: publisher.address || "",
        contactInfo: publisher.contactInfo || ""
      })
    } else {
      // Reset form for new publisher
      setFormData({
        name: "",
        address: "",
        contactInfo: ""
      })
    }
  }, [publisher])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Publisher name is required!")
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{publisher ? "Edit Publisher" : "Add New Publisher"}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Publisher Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter publisher name"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className="form-group">
            <label>Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={formData.contactInfo}
              onChange={handleChange}
              placeholder="Enter contact info"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {publisher ? "Update Publisher" : "Add Publisher"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PublisherFormModal