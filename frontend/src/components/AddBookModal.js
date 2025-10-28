"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"
import CustomSelect from "./CustomSelect"

const AddBookModal = ({ isOpen, onClose, onBookAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    isbn: "",
    publishedYear: new Date().getFullYear(),
    language: "English",
    copies: 1,
    category: "",
    author: null,
    publisher: null,
    availability: "AVAILABLE"
  })

  const [authors, setAuthors] = useState([])
  const [publishers, setPublishers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (isOpen) {
      fetchAuthorsAndPublishers()
    }
  }, [isOpen])

  // Update availability when copies change
  useEffect(() => {
    const newAvailability = formData.copies === 0 ? "UNAVAILABLE" : "AVAILABLE"
    setFormData(prev => ({
      ...prev,
      availability: newAvailability
    }))
  }, [formData.copies])

  const fetchAuthorsAndPublishers = async () => {
    try {
      const [authorsRes, publishersRes] = await Promise.all([
        AuthorService.getAllAuthors(),
        PublisherService.getAllPublishers(),
      ])

      console.log("📝 Raw authors data:", authorsRes.data)
      console.log("🏢 Raw publishers data:", publishersRes.data)

      setAuthors(authorsRes.data || [])
      setPublishers(publishersRes.data || [])
    } catch (err) {
      console.error("Error fetching authors/publishers:", err)
      setError("Failed to load authors and publishers")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("📤 Form data being submitted:", formData)

    if (!formData.title || !formData.isbn || !formData.author || !formData.publisher) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      const bookData = {
        title: formData.title,
        isbn: formData.isbn,
        publishedYear: formData.publishedYear,
        language: formData.language,
        copies: formData.copies,
        category: formData.category,
        authorID: formData.author,
        publisherID: formData.publisher,
        availability: formData.availability
      }

      console.log("📦 Final book data to send:", bookData)

      await BookService.createBook(bookData)
      onBookAdded()
      onClose()

      // Reset form
      setFormData({
        title: "",
        isbn: "",
        publishedYear: new Date().getFullYear(),
        language: "English",
        copies: 1,
        category: "",
        author: null,
        publisher: null,
        availability: "AVAILABLE"
      })
      setError("")
    } catch (error) {
      console.error("Error adding book:", error)
      setError(error.response?.data?.message || "Failed to add book. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(`🔄 Input change: ${name} = ${value}`)

    setFormData(prev => ({
      ...prev,
      [name]: name === "copies" || name === "publishedYear" ? Number.parseInt(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    console.log(`🎯 Select change: ${name} = ${value}`)
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Book</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                required
              />
            </div>

            <div className="form-group">
              <label>ISBN *</label>
              <input
                type="text"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                placeholder="Enter ISBN"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>
              <CustomSelect
                name="author"
                value={formData.author}
                onChange={(e) => handleSelectChange('author', e.target.value)}
                options={authors}
                placeholder="Select an author"
                required
              />
            </div>

            <div className="form-group">
              <label>Publisher *</label>
              <CustomSelect
                name="publisher"
                value={formData.publisher}
                onChange={(e) => handleSelectChange('publisher', e.target.value)}
                options={publishers}
                placeholder="Select a publisher"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Published Year</label>
              <input
                type="number"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleChange}
                min="1900"
                max="2030"
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Fiction, Science"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Language</label>
              <select name="language" value={formData.language} onChange={handleChange}>
                <option value="English">English</option>
                <option value="Sinhala">Sinhala</option>
                <option value="Tamil">Tamil</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Copies</label>
              <input
                type="number"
                name="copies"
                value={formData.copies}
                onChange={handleChange}
                min="0"
                max="100"
              />
              <div className="availability-status">
                Status: {formData.availability === "AVAILABLE" ? "Available" : "Unavailable"}
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Adding..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddBookModal