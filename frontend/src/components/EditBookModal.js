"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"

const EditBookModal = ({ isOpen, onClose, book, onBookUpdated }) => {
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
    if (isOpen && book) {
      fetchAuthorsAndPublishers()
      setFormData({
        title: book.title || "",
        isbn: book.isbn || "",
        publishedYear: book.publishedYear || new Date().getFullYear(),
        language: book.language || "English",
        copies: book.copies || 1,
        category: book.category || "",
        author: book.authorID || book.author?.authorID || null,
        publisher: book.publisherID || book.publisher?.publisherID || null,
        availability: book.availability || "AVAILABLE"
      })
    }
  }, [isOpen, book])

  const fetchAuthorsAndPublishers = async () => {
    try {
      const [authorsRes, publishersRes] = await Promise.all([
        AuthorService.getAllAuthors(),
        PublisherService.getAllPublishers(),
      ])
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

      await BookService.updateBook(book.bookID, bookData)
      onBookUpdated()
      onClose()
      alert("Book updated successfully!")
    } catch (error) {
      console.error("Error updating book:", error)
      setError(error.response?.data?.message || "Failed to update book. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "copies" || name === "publishedYear" ? Number.parseInt(value) || 0 : value,
    })
  }

  if (!isOpen || !book) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Book</h2>
          <button className="close-btn" onClick={onClose}>×</button>
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
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>
              <select
                name="author"
                value={formData.author || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select an author</option>
                {authors.map((author) => (
                  <option key={author.authorID} value={author.authorID}>
                    {author.authorName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Publisher *</label>
              <select
                name="publisher"
                value={formData.publisher || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select a publisher</option>
                {publishers.map((publisher) => (
                  <option key={publisher.publisherID} value={publisher.publisherID}>
                    {publisher.name}
                  </option>
                ))}
              </select>
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
              <label>Status</label>
              <select name="availability" value={formData.availability} onChange={handleChange}>
                <option value="AVAILABLE">Available</option>
                <option value="BORROWED">Borrowed</option>
                <option value="RESERVED">Reserved</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Copies</label>
              <input type="number" name="copies" value={formData.copies} onChange={handleChange} min="1" max="100" />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Updating..." : "Update Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBookModal