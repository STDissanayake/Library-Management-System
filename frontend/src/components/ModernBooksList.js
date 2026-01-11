"use client"

import { useState, useEffect, useRef } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"
import "./ModernBooksList.css"

const ModernBooksList = ({ mode = "books", onNavigate } = {}) => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  const [authorsById, setAuthorsById] = useState({})
  const [publishersById, setPublishersById] = useState({})
  const [hoverCard, setHoverCard] = useState({ visible: false, pinned: false, type: null, id: null, x: 0, y: 0 })
  const hoverCardRef = useRef(null)
  const closeTimerRef = useRef(null)

  useEffect(() => {
    if (mode !== "books") return
    fetchBooks()
  }, [mode])

  useEffect(() => {
    if (mode !== "books") return

    const loadRefs = async () => {
      try {
        const [authorsRes, publishersRes] = await Promise.all([
          AuthorService.getAllAuthors(),
          PublisherService.getAllPublishers(),
        ])

        const authors = Array.isArray(authorsRes.data) ? authorsRes.data : []
        const publishers = Array.isArray(publishersRes.data) ? publishersRes.data : []

        const nextAuthors = {}
        for (const a of authors) {
          const id = a?.id ?? a?.authorID
          if (id == null) continue
          nextAuthors[id] = {
            id,
            name: a?.name ?? a?.authorName ?? "",
            bio: a?.bio ?? "",
          }
        }

        const nextPublishers = {}
        for (const p of publishers) {
          const id = p?.id ?? p?.publisherID
          if (id == null) continue
          nextPublishers[id] = {
            id,
            name: p?.name ?? "",
            address: p?.address ?? "",
            contactInfo: p?.contactInfo ?? p?.contact_info ?? "",
          }
        }

        setAuthorsById(nextAuthors)
        setPublishersById(nextPublishers)
      } catch (err) {
        console.error("Error fetching author/publisher references:", err)
      }
    }

    loadRefs()
  }, [mode])

  useEffect(() => {
    if (!hoverCard.visible || !hoverCard.pinned) return

    const onMouseDown = (e) => {
      if (hoverCardRef.current && !hoverCardRef.current.contains(e.target)) {
        closeHoverCard()
      }
    }

    document.addEventListener("mousedown", onMouseDown)
    return () => {
      document.removeEventListener("mousedown", onMouseDown)
    }
  }, [hoverCard.visible, hoverCard.pinned])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      setError("")
      const response = await BookService.getAllBooks()
      setBooks(response.data || [])
    } catch (err) {
      console.error("Error fetching books:", err)
      const status = err?.response?.status
      const apiMessage = err?.response?.data?.message
      const message = apiMessage || err?.message
      setError(`Failed to load books${status ? ` (HTTP ${status})` : ""}: ${message || "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (book) => {
    setEditingBook(book)
    setShowAddModal(true)
  }

  const handleDelete = async (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await BookService.deleteBook(bookId)
        setBooks(books.filter(book => book.id !== bookId))
        alert("Book deleted successfully!")
      } catch (err) {
        console.error("Error deleting book:", err)
        alert("Failed to delete book: " + (err.response?.data?.message || err.message))
      }
    }
  }

  const handleSaveBook = async (bookData) => {
    try {
      const totalCopies = Number(bookData.totalCopies)
      const availableCopies = Number(bookData.availableCopies)

      const payload = {
        title: bookData.title,
        isbn: bookData.isbn,
        publicationDate: bookData.publicationDate || null,
        category: bookData.category,
        status: bookData.status,
        totalCopies: Number.isNaN(totalCopies) ? null : totalCopies,
        availableCopies: Number.isNaN(availableCopies) ? null : availableCopies,
        author: { id: Number(bookData.authorId) },
        publisher: { id: Number(bookData.publisherId) },
      }

      if (editingBook) {
        await BookService.updateBook(editingBook.id, payload)
        alert("Book updated successfully!")
      } else {
        await BookService.createBook(payload)
        alert("Book added successfully!")
      }
      fetchBooks()
      setShowAddModal(false)
      setEditingBook(null)
    } catch (err) {
      console.error("Error saving book:", err)
      alert("Failed to save book: " + (err.response?.data?.message || err.message))
    }
  }

  const handleAddBook = () => {
    setEditingBook(null)
    setShowAddModal(true)
  }

  const formatPublishedDate = (book) => {
    const raw = book?.publicationDate ?? book?.publishedDate ?? book?.publishedYear ?? null
    if (raw == null || raw === "") return "N/A"
    if (typeof raw === "number") return String(raw)

    const date = new Date(raw)
    if (Number.isNaN(date.getTime())) return String(raw)
    return date.toLocaleDateString()
  }

  const clearHoverCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const scheduleHoverClose = () => {
    clearHoverCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setHoverCard((prev) => {
        if (prev.pinned) return prev
        return { visible: false, pinned: false, type: null, id: null, x: 0, y: 0 }
      })
    }, 120)
  }

  const openHoverCard = (e, type, id, pinned = false) => {
    const rect = e.currentTarget.getBoundingClientRect()
    clearHoverCloseTimer()
    setHoverCard({
      visible: true,
      pinned,
      type,
      id,
      x: rect.left,
      y: rect.bottom + 8,
    })
  }

  const closeHoverCard = () => {
    clearHoverCloseTimer()
    setHoverCard({ visible: false, pinned: false, type: null, id: null, x: 0, y: 0 })
  }

  const getFilteredBooks = () => books

  if (mode === "hub") {
    return (
      <div className="modern-books-list lb-page">
        <div className="books-management">
          <div className="books-management-header lb-page-header">
            <h1 className="lb-page-title">Library Resources</h1>
          </div>

          <div className="books-hub-cards">
            <button
              type="button"
              className="books-hub-card primary"
              onClick={() => onNavigate && onNavigate("books")}
            >
              <div className="books-hub-card-title">Books</div>
              <div className="books-hub-card-subtitle">View and manage library books</div>
            </button>
            <button
              type="button"
              className="books-hub-card secondary"
              onClick={() => onNavigate && onNavigate("authors")}
            >
              <div className="books-hub-card-title">Authors</div>
              <div className="books-hub-card-subtitle">View and manage authors</div>
            </button>
            <button
              type="button"
              className="books-hub-card warning"
              onClick={() => onNavigate && onNavigate("publishers")}
            >
              <div className="books-hub-card-title">Publishers</div>
              <div className="books-hub-card-subtitle">View and manage publishers</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="modern-books-list">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading books...</h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="modern-books-list">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3>Error Loading Books</h3>
            <p>{error}</p>
            <button onClick={fetchBooks} className="retry-btn">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modern-books-list lb-page">
      <div className="books-management">
        <div className="books-management-header lb-page-header">
          <h1 className="lb-page-title">Books</h1>
          <div className="lb-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate && onNavigate("resources")}
            >
              Back
            </button>
            <button className="btn btn-primary" onClick={handleAddBook}>
              + Add New Book
            </button>
          </div>
        </div>

        <div className="books-table lb-card">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Category</th>
                <th>Published Date</th>
                <th>Total Copies</th>
                <th>Available Copies</th>
                <th>Status</th>
                <th>ISBN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredBooks().map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>
                    <span
                      className="lb-hover-target"
                      onMouseEnter={(e) => {
                        const authorId = book?.author?.id ?? book?.author?.authorID
                        if (authorId == null) return
                        openHoverCard(e, "author", authorId, false)
                      }}
                      onMouseLeave={scheduleHoverClose}
                      onClick={(e) => {
                        const authorId = book?.author?.id ?? book?.author?.authorID
                        if (authorId == null) return
                        e.stopPropagation()
                        openHoverCard(e, "author", authorId, true)
                      }}
                    >
                      {book?.author?.name || book?.author?.authorName || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <span
                      className="lb-hover-target"
                      onMouseEnter={(e) => {
                        const publisherId = book?.publisher?.id ?? book?.publisher?.publisherID
                        if (publisherId == null) return
                        openHoverCard(e, "publisher", publisherId, false)
                      }}
                      onMouseLeave={scheduleHoverClose}
                      onClick={(e) => {
                        const publisherId = book?.publisher?.id ?? book?.publisher?.publisherID
                        if (publisherId == null) return
                        e.stopPropagation()
                        openHoverCard(e, "publisher", publisherId, true)
                      }}
                    >
                      {book?.publisher?.name || "Unknown"}
                    </span>
                  </td>
                  <td>{book.category}</td>
                  <td>{formatPublishedDate(book)}</td>
                  <td>{book.totalCopies ?? "-"}</td>
                  <td>{book.availableCopies ?? "-"}</td>
                  <td>{book.status}</td>
                  <td>{book.isbn}</td>
                  <td>
                    <div className="books-actions">
                      <button className="btn btn-secondary" onClick={() => handleEdit(book)}>
                        Edit
                      </button>
                      <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {getFilteredBooks().length === 0 && (
            <div className="no-data lb-empty">
              <i className="fas fa-book"></i>
              <h3>No book records found</h3>
              <p>Start by adding a book to the library.</p>
            </div>
          )}
        </div>

        {hoverCard.visible && hoverCard.type === "author" && (
          <div
            ref={hoverCardRef}
            className="lb-hover-card"
            style={{
              left: Math.min(hoverCard.x, Math.max(0, window.innerWidth - 380)),
              top: Math.min(hoverCard.y, Math.max(0, window.innerHeight - 240)),
            }}
            onMouseEnter={clearHoverCloseTimer}
            onMouseLeave={() => {
              if (!hoverCard.pinned) scheduleHoverClose()
            }}
          >
            <div className="lb-hover-card-title">Author</div>
            <div className="lb-hover-card-name">
              {authorsById[hoverCard.id]?.name || "Unknown"}
            </div>
            <div className="lb-hover-card-body">
              {authorsById[hoverCard.id]?.bio || "No bio available"}
            </div>
          </div>
        )}

        {hoverCard.visible && hoverCard.type === "publisher" && (
          <div
            ref={hoverCardRef}
            className="lb-hover-card"
            style={{
              left: Math.min(hoverCard.x, Math.max(0, window.innerWidth - 380)),
              top: Math.min(hoverCard.y, Math.max(0, window.innerHeight - 260)),
            }}
            onMouseEnter={clearHoverCloseTimer}
            onMouseLeave={() => {
              if (!hoverCard.pinned) scheduleHoverClose()
            }}
          >
            <div className="lb-hover-card-title">Publisher</div>
            <div className="lb-hover-card-name">
              {publishersById[hoverCard.id]?.name || "Unknown"}
            </div>
            <div className="lb-hover-card-body">
              {publishersById[hoverCard.id]?.contactInfo || "No contact details available"}
            </div>
          </div>
        )}

        {/* Book Modal */}
        {showAddModal && (
          <BookModal
            book={editingBook}
            onClose={() => setShowAddModal(false)}
            onSave={handleSaveBook}
          />
        )}
      </div>
    </div>
  )
}

// Book Modal Component
const BookModal = ({ book, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    isbn: book?.isbn || "",
    publicationDate: book?.publicationDate || "",
    category: book?.category || "Fiction",
    status: book?.status || "Available",
    totalCopies: book?.totalCopies ?? 1,
    availableCopies: book?.availableCopies ?? (book?.totalCopies ?? 1),
    authorId: book?.author?.id || "",
    publisherId: book?.publisher?.id || "",
  })

  const [authors, setAuthors] = useState([])
  const [publishers, setPublishers] = useState([])
  const [loadingRefs, setLoadingRefs] = useState(false)
  const [refsError, setRefsError] = useState("")

  useEffect(() => {
    const loadRefs = async () => {
      try {
        setLoadingRefs(true)
        setRefsError("")
        const [authorsRes, publishersRes] = await Promise.all([
          AuthorService.getAllAuthors(),
          PublisherService.getAllPublishers(),
        ])
        setAuthors(authorsRes.data || [])
        setPublishers(publishersRes.data || [])
      } catch (err) {
        console.error("Error fetching authors/publishers:", err)
        setRefsError("Failed to load authors and publishers")
      } finally {
        setLoadingRefs(false)
      }
    }

    loadRefs()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "totalCopies" || name === "availableCopies") {
      const parsed = Number.parseInt(value, 10)
      setFormData(prev => {
        const next = { ...prev, [name]: Number.isNaN(parsed) ? "" : parsed }
        if (name === "totalCopies" && (prev.availableCopies == null || prev.availableCopies === "")) {
          next.availableCopies = Number.isNaN(parsed) ? "" : parsed
        }
        return next
      })
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.authorId || !formData.publisherId) {
      alert("Please select an author and a publisher")
      return
    }

    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{book ? "Edit Book" : "Add New Book"}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-row">
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
          </div>

          {refsError && <div className="error-message">{refsError}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Author *</label>
              <select
                name="authorId"
                value={formData.authorId}
                onChange={handleChange}
                required
                disabled={loadingRefs}
              >
                <option value="">Select an author</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Publisher *</label>
              <select
                name="publisherId"
                value={formData.publisherId}
                onChange={handleChange}
                required
                disabled={loadingRefs}
              >
                <option value="">Select a publisher</option>
                {publishers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Publication Date</label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="History">History</option>
                <option value="Biography">Biography</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} required>
                <option value="Available">Available</option>
                <option value="Borrowed">Borrowed</option>
                <option value="Reserved">Reserved</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Copies</label>
              <input
                type="number"
                name="totalCopies"
                value={formData.totalCopies}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Available Copies</label>
              <input
                type="number"
                name="availableCopies"
                value={formData.availableCopies}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {book ? "Update" : "Add"} Book
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModernBooksList
