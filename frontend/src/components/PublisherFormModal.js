"use client"

import { useState, useEffect } from "react"
import "./PublisherFormModal.css"

const PublisherFormModal = ({ publisher, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    publishedYear: new Date().getFullYear()
  })

  useEffect(() => {
    if (publisher) {
      setFormData({
        name: publisher.name || "",
        publishedYear: publisher.publishedYear || new Date().getFullYear()
      })
    } else {
      // Reset form for new publisher
      setFormData({
        name: "",
        publishedYear: new Date().getFullYear()
      })
    }
  }, [publisher])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'publishedYear' ? parseInt(value) || '' : value,
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
            <label>Established Year *</label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              required
              placeholder="Enter established year"
              min="1500"
              max={new Date().getFullYear() + 5}
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