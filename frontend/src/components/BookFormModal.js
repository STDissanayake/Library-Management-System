"use client"

import { useState, useEffect } from "react"
import "./BookFormModal.css"

const BookFormModal = ({ book, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publishedYear: "",
    language: "English",
    availability: "Available",
    copies: 1,
    category: "",
    authorID: "",
    publisherID: "",
  })

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || "",
        isbn: book.isbn || "",
        publishedYear: book.publishedYear || "",
        language: book.language || "English",
        availability: book.availability || "Available",
        copies: book.copies || 1,
        category: book.category || "",
        authorID: book.authorID || "",
        publisherID: book.publisherID || "",
      })
    }
  }, [book])

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
          <h2>{book ? "Edit Book" : "Add New Book"}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
            />
          </div>

          <div className="form-group">
            <label>ISBN</label>
            <input type="text" name="isbn" value={formData.isbn} onChange={handleChange} placeholder="Enter ISBN" />
          </div>

          <div className="form-group">
            <label>Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear}
              onChange={handleChange}
              placeholder="Enter published year"
            />
          </div>

          <div className="form-group">
            <label>Language</label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              placeholder="Enter language"
            />
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select name="availability" value={formData.availability} onChange={handleChange}>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
              <option value="Borrowed">Borrowed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Copies</label>
            <input type="number" name="copies" value={formData.copies} onChange={handleChange} min="1" />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Enter category"
            />
          </div>

          <div className="form-group">
            <label>Author ID</label>
            <input
              type="number"
              name="authorID"
              value={formData.authorID}
              onChange={handleChange}
              placeholder="Enter author ID"
            />
          </div>

          <div className="form-group">
            <label>Publisher ID</label>
            <input
              type="number"
              name="publisherID"
              value={formData.publisherID}
              onChange={handleChange}
              placeholder="Enter publisher ID"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              {book ? "Update Book" : "Add Book"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <div className="form-row">
      <div className="form-group">
        <label>Status</label>
        <select name="availability" value={formData.availability} onChange={handleChange}>
          <option value="AVAILABLE">Available</option>
          <option value="BORROWED">Borrowed</option>
          <option value="RESERVED">Reserved</option>
          <option value="UNAVAILABLE">Unavailable</option>
        </select>
      </div>

      <div className="form-group">
        <label>Copies</label>
        <input type="number" name="copies" value={formData.copies} onChange={handleChange} min="1" max="100" />
      </div>
    </div>
  )
}

export default BookFormModal
