"use client"

import { useState, useEffect } from "react"
import "./FormModal.css"

const AuthorFormModal = ({ author, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    nationality: "",
  })

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || author.authorName || "",
        bio: author.bio || "",
        nationality: author.nationality || "",
      })
    }
  }, [author])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{author ? "Edit Author" : "Add New Author"}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Author Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group">
            <label>Biography</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter author biography"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>Nationality</label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              placeholder="Enter nationality"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {author ? "Update Author" : "Add Author"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthorFormModal
