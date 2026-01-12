"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"

const EditBookModal = ({ isOpen, onClose, book, onBookUpdated }) => {
  const normalizeStatus = (status) => (status || "").toString().trim().toUpperCase()

  const toAvailability = (bookLike) => {
    const copies = Number(bookLike?.availableCopies)
    if (!Number.isNaN(copies) && copies <= 0) return "UNAVAILABLE"

    const s = normalizeStatus(bookLike?.availability || bookLike?.status)
    if (s === "BORROWED") return "UNAVAILABLE"
    if (s === "RESERVED") return "UNAVAILABLE"
    if (s === "UNAVAILABLE" || s === "NOT_AVAILABLE" || s === "NOT AVAILABLE") return "UNAVAILABLE"
    if (s === "AVAILABLE" || s === "AVAIL" || s === "IN_STOCK" || s === "IN-STOCK" || s === "AVAILABLE") return "AVAILABLE"

    if (s === "AVAILABLE") return "AVAILABLE"
    if (s === "AVAILABLE".toUpperCase()) return "AVAILABLE"
    if (s === "AVAILABLE" || s === "AVAILABLE".toUpperCase()) return "AVAILABLE"
    if (s === "AVAILABLE") return "AVAILABLE"

    // handle legacy values like "Available" / "Borrowed"
    if (s === "AVAILABLE") return "AVAILABLE"
    if (s === "BORROWED") return "UNAVAILABLE"

    if (s === "AVAILABLE" || s === "AVAILABLE".toUpperCase()) return "AVAILABLE"
    if (s === "BORROWED" || s === "BORROWED".toUpperCase()) return "UNAVAILABLE"

    if (s === "AVAILABLE") return "AVAILABLE"
    return "AVAILABLE"
  }

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
        copies: (book.totalCopies ?? book.copies ?? 1),
        category: book.category || "",
        author: book.author?.id ?? book.author?.authorID ?? book.authorID ?? null,
        publisher: book.publisher?.id ?? book.publisher?.publisherID ?? book.publisherID ?? null,
        availability: toAvailability(book)
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
      const copies = Number.parseInt(formData.copies, 10)
      const normalizedCopies = Number.isNaN(copies) ? null : Math.max(0, copies)

      const availability =
        normalizedCopies === 0 ? "UNAVAILABLE" : normalizeStatus(formData.availability)
      const statusMap = {
        AVAILABLE: "Available",
        UNAVAILABLE: "Unavailable",
      }
      const backendStatus = statusMap[availability] || "Available"

      const computedAvailableCopies =
        normalizedCopies == null
          ? null
          : availability === "AVAILABLE"
            ? normalizedCopies
            : 0

      const bookData = {
        title: formData.title,
        isbn: formData.isbn,
        publicationDate: null,
        category: formData.category,
        status: backendStatus,
        totalCopies: normalizedCopies,
        availableCopies: computedAvailableCopies,
        author: { id: Number(formData.author) },
        publisher: { id: Number(formData.publisher) },
      }

      await BookService.updateBook(book.bookID || book.id, bookData)
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
                  <option key={author.id ?? author.authorID} value={author.id ?? author.authorID}>
                    {author.name ?? author.authorName}
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
                  <option key={publisher.id ?? publisher.publisherID} value={publisher.id ?? publisher.publisherID}>
                    {publisher.name ?? publisher.publisherName}
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
                <option value="UNAVAILABLE">Unavailable</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Copies</label>
              <input type="number" name="copies" value={formData.copies} onChange={handleChange} min="0" max="100" />
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