"use client"

import { useState, useEffect, useRef } from "react"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"
import "./BookFormModal.css"

const BookFormModal = ({ book, onSave, onClose, isOpen }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publishedYear: new Date().getFullYear(),
    language: "English",
    availability: "AVAILABLE",
    copies: 1,
    category: "",
    authorID: "",
    publisherID: "",
  })

  const [authors, setAuthors] = useState([])
  const [publishers, setPublishers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const hasLoadedData = useRef(false)

  // Load authors and publishers when modal opens
  useEffect(() => {
    if (isOpen && !hasLoadedData.current) {
      const loadInitialData = async () => {
        try {
          setIsLoading(true)
          console.log("📚 Loading authors and publishers...")

          const [authorsRes, publishersRes] = await Promise.all([
            AuthorService.getAllAuthors(),
            PublisherService.getAllPublishers()
          ])

          console.log("✅ Authors loaded:", authorsRes.data?.length)
          console.log("✅ Publishers loaded:", publishersRes.data?.length)

          setAuthors(authorsRes.data || [])
          setPublishers(publishersRes.data || [])
          hasLoadedData.current = true
        } catch (error) {
          console.error('❌ Error loading initial data:', error)
        } finally {
          setIsLoading(false)
        }
      }

      loadInitialData()
    }
  }, [isOpen])

  // Set form data when book prop changes (for edit mode)
  useEffect(() => {
    if (book) {
      console.log("📖 Setting form data for book:", book)
      setFormData({
        title: book.title || "",
        isbn: book.isbn || "",
        publishedYear: book.publishedYear || new Date().getFullYear(),
        language: book.language || "English",
        availability: book.availability || "AVAILABLE",
        copies: book.copies || 1,
        category: book.category || "",
        authorID: book.authorID || "",
        publisherID: book.publisherID || "",
      })
    } else {
      // Reset form for new book
      setFormData({
        title: "",
        isbn: "",
        publishedYear: new Date().getFullYear(),
        language: "English",
        availability: "AVAILABLE",
        copies: 1,
        category: "",
        authorID: "",
        publisherID: "",
      })
    }
  }, [book])

  // Auto-update availability when copies change to 0
  useEffect(() => {
    if (formData.copies === 0) {
      console.log("🔄 Copies is 0, automatically setting availability to UNAVAILABLE")
      setFormData(prev => ({
        ...prev,
        availability: "UNAVAILABLE"
      }))
    }
  }, [formData.copies])

  const handleChange = (e) => {
    const { name, value } = e.target

    console.log(`🔄 Field changed: ${name} = ${value}`)

    if (name === 'copies') {
      const copiesValue = parseInt(value) || 0

      setFormData(prev => ({
        ...prev,
        copies: copiesValue
      }))
    } else if (name === 'publishedYear') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || new Date().getFullYear()
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log("📤 Submitting form data:", formData)
    onSave(formData)
  }

  // Manual refresh functions using your services
  const refreshAuthors = async () => {
    try {
      console.log("🔄 Manually refreshing authors...")
      setIsLoading(true)
      const response = await AuthorService.getAllAuthors()
      setAuthors(response.data || [])
      console.log("✅ Authors refreshed:", response.data?.length)
    } catch (error) {
      console.error('❌ Error refreshing authors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshPublishers = async () => {
    try {
      console.log("🔄 Manually refreshing publishers...")
      setIsLoading(true)
      const response = await PublisherService.getAllPublishers()
      setPublishers(response.data || [])
      console.log("✅ Publishers refreshed:", response.data?.length)
    } catch (error) {
      console.error('❌ Error refreshing publishers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    hasLoadedData.current = false
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="book-modal-overlay" onClick={handleClose}>
      <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="book-modal-header">
          <h2>{book ? "Edit Book" : "Add New Book"}</h2>
          <button className="book-close-modal-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>

            <div className="book-form-group">
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

            <div className="book-form-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                placeholder="Enter ISBN"
              />
            </div>

            <div className="form-row">
              <div className="book-form-group">
                <label>Published Year</label>
                <input
                  type="number"
                  name="publishedYear"
                  value={formData.publishedYear}
                  onChange={handleChange}
                  placeholder="Enter published year"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                />
              </div>

              <div className="book-form-group">
                <label>Language</label>
                <select name="language" value={formData.language} onChange={handleChange}>
                  <option value="English">English</option>
                  <option value="Sinhala">Sinhala</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="book-form-group">
                <label>Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Enter category (e.g., Fiction, Science)"
                />
              </div>

              <div className="book-form-group">
                <label>Copies *</label>
                <input
                  type="number"
                  name="copies"
                  value={formData.copies}
                  onChange={handleChange}
                  min="0"  {/* CHANGED FROM min="1" to min="0" */}
                  max="1000"
                  required
                />
                <div className="copies-help">
                  {formData.copies === 0 ? (
                    <span style={{color: '#dc3545'}}>⚠️ Book will be marked as Not Available</span>
                  ) : formData.copies === 1 ? (
                    <span style={{color: '#28a745'}}>✓ 1 copy available</span>
                  ) : (
                    <span style={{color: '#28a745'}}>✓ {formData.copies} copies available</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Availability Status (Manual Selection) */}
          <div className="form-section">
            <h3>Availability Status</h3>

            <div className="book-form-group">
              <label>Availability *</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                disabled={formData.copies === 0} // Disable when copies is 0
              >
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Not Available</option>
              </select>
              <div className="status-help">
                {formData.copies === 0 ? (
                  <span style={{color: '#dc3545'}}>
                    ⚠️ Copies is set to 0, so availability is automatically set to "Not Available"
                  </span>
                ) : (
                  "You can manually set the availability status"
                )}
              </div>
            </div>

            {/* Current Status Display */}
            <div className="book-form-group status-display">
              <label>Current Status Display</label>
              <div className={`status-badge ${formData.availability === 'AVAILABLE' ? 'available' : 'not-available'}`}>
                {formData.availability === 'AVAILABLE' ? 'Available' : 'Not Available'}
              </div>
              <div className="status-help">
                This is how the status will appear to users
              </div>
            </div>
          </div>

          {/* Relationships */}
          <div className="form-section">
            <h3>Relationships</h3>

            {/* Author selection */}
            <div className="book-form-group">
              <label>Author *</label>
              <div className="select-with-refresh">
                <select
                  name="authorID"
                  value={formData.authorID}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Author</option>
                  {authors.map(author => (
                    <option key={author.authorID} value={author.authorID}>
                      {author.authorName}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={refreshAuthors}
                  className="refresh-btn"
                  disabled={isLoading}
                  title="Refresh authors list"
                >
                  ↻
                </button>
              </div>
              <div className="refresh-help">
                Authors loaded: {authors.length} | Click refresh if you need the latest list
              </div>
            </div>

            {/* Publisher selection */}
            <div className="book-form-group">
              <label>Publisher *</label>
              <div className="select-with-refresh">
                <select
                  name="publisherID"
                  value={formData.publisherID}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Publisher</option>
                  {publishers.map(publisher => (
                    <option key={publisher.publisherID} value={publisher.publisherID}>
                      {publisher.name}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={refreshPublishers}
                  className="refresh-btn"
                  disabled={isLoading}
                  title="Refresh publishers list"
                >
                  ↻
                </button>
              </div>
              <div className="refresh-help">
                Publishers loaded: {publishers.length} | Click refresh if you need the latest list
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="book-form-actions">
            <button type="button" className="book-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="book-btn-submit" disabled={isLoading}>
              {isLoading ? "Loading..." : (book ? "Update Book" : "Add Book")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookFormModal