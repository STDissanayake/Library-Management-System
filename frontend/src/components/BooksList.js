"use client"

import { useState, useEffect } from "react"
import BookService from "../service/BookService"
import AuthorService from "../service/AuthorService"
import PublisherService from "../service/PublisherService"
import BookHoverCard from "./BookHoverCard"
import AuthorHoverCard from "./AuthorHoverCard"
import PublisherHoverCard from "./PublisherHoverCard"
import AddBookModal from "./AddBookModal"
import EditBookModal from "./EditBookModal"
import "./BooksList.css"

const BooksList = () => {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [hoveredBook, setHoveredBook] = useState(null)
  const [hoveredAuthor, setHoveredAuthor] = useState(null)
  const [hoveredPublisher, setHoveredPublisher] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  useEffect(() => {
    fetchBooks()
  }, [])

  const fetchBooks = async () => {
    try {
      setLoading(true)
      const response = await BookService.getAllBooks()
      console.log("📚 FULL BOOKS API RESPONSE:", response)

      const booksData = response.data || response || []
      console.log("📚 BOOKS DATA:", booksData)

      setBooks(booksData)
      setError(null)
    } catch (err) {
      console.error("❌ Error fetching books:", err)
      setError("Failed to load books. Please check if the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  // Simple author click handler
  const handleAuthorClick = (authorID, authorName) => {
    console.log("🟡 Clicked author:", authorName)

    setHoveredAuthor({
      authorName: authorName,
      authorID: authorID,
      bio: "View detailed author profiles in the Authors section."
    })
  }

  // Simple publisher click handler
  const handlePublisherClick = (publisherID, publisherName) => {
    console.log("🟡 Clicked publisher:", publisherName)

    setHoveredPublisher({
      name: publisherName,
      publisherID: publisherID,
      description: "View detailed publisher information in the Publishers section."
    })
  }

  // Simple data extraction
  const getAuthorName = (book) => {
    return book.authorName || "Unknown Author"
  }

  const getAuthorId = (book) => {
    return book.authorID || null
  }

  const getPublisherName = (book) => {
    return book.publisherName || "Unknown Publisher"
  }

  const getPublisherId = (book) => {
    return book.publisherID || null
  }

  const getBookId = (book) => {
    return book.bookID || book.id || Math.random()
  }

  const getAvailability = (book) => {
    return book.availability || book.status || "UNKNOWN"
  }

  const getStatusClass = (status) => {
    if (!status) return "unknown"
    const statusValue = status.toString().toUpperCase()
    switch (statusValue) {
      case "AVAILABLE":
        return "available"
      case "BORROWED":
      case "RESERVED":
      case "NOT_AVAILABLE":
      case "NOT AVAILABLE":
      case "UNAVAILABLE":
        return "not-available"
      default:
        return "unknown"
    }
  }

  const getStatusText = (status) => {
    if (!status) return "Unknown"
    const statusValue = status.toString().toUpperCase()
    switch (statusValue) {
      case "AVAILABLE":
        return "Available"
      case "BORROWED":
        return "Borrowed"
      case "RESERVED":
        return "Reserved"
      case "NOT_AVAILABLE":
      case "NOT AVAILABLE":
      case "UNAVAILABLE":
        return "Not Available"
      default:
        return "Unknown"
    }
  }

  // Simple search
  useEffect(() => {
    const searchBooks = async () => {
      try {
        setLoading(true)
        let booksData = []

        if (searchTerm.trim()) {
          console.log(`🔍 Searching for: "${searchTerm}"`)

          try {
            const response = await BookService.searchBooks(searchTerm)
            booksData = response.data || []
            console.log(`✅ Search found ${booksData.length} books`)
          } catch (searchError) {
            console.error('❌ Search failed:', searchError)
            // Fallback to client-side filtering
            const allResponse = await BookService.getAllBooks()
            const allBooks = allResponse.data || allResponse || []
            booksData = allBooks.filter(book =>
              (book.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (book.authorName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (book.isbn?.includes(searchTerm))
            )
            console.log(`✅ Client-side filtering found ${booksData.length} books`)
          }
        } else {
          // No search term - get all books
          const response = await BookService.getAllBooks()
          booksData = response.data || response || []
          console.log(`📚 Loaded all ${booksData.length} books`)
        }

        setBooks(booksData)
        setError(null)
      } catch (err) {
        console.error("❌ Error in search:", err)
        setError("Search failed. Showing all books.")
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(searchBooks, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleEdit = (book) => {
    console.log("Editing book:", book)
    setEditingBook(book)
    setShowEditModal(true)
  }

  const handleUpdateBook = () => {
    fetchBooks()
    setShowEditModal(false)
    setEditingBook(null)
  }

  const handleDelete = async (bookID) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await BookService.deleteBook(bookID)
        setBooks(books.filter((book) => book.bookID !== bookID))
        alert("Book deleted successfully!")
      } catch (err) {
        console.error("Error deleting book:", err)
        alert("Failed to delete book: " + (err.response?.data?.message || err.message))
      }
    }
  }

  const filteredBooks = books

  if (loading) return <div className="loading">Loading books...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="books-container">
      <div className="books-header">
        <h1>📚 Books ({filteredBooks.length})</h1>
        <button className="btn btn-secondary" onClick={() => setShowAddModal(true)}>
          + Add New Book
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by title, author, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th className="col-no">#</th>
              <th className="col-title">TITLE</th>
              <th className="col-author">AUTHOR</th>
              <th className="col-publisher">PUBLISHER</th>
              <th className="col-isbn">ISBN</th>
              <th className="col-year">YEAR</th>
              <th className="col-copies">COPIES</th>
              <th className="col-status">STATUS</th>
              <th className="col-actions">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty-state">
                  <div>📖</div>
                  <h4>No books found</h4>
                  <p>Try adjusting your search or add a new book.</p>
                  <button
                    className="btn-primary"
                    onClick={() => setShowAddModal(true)}
                    style={{marginTop: '10px'}}
                  >
                    + Add First Book
                  </button>
                </td>
              </tr>
            ) : (
              filteredBooks.map((book, index) => (
                <tr key={getBookId(book)}>
                  <td className="col-no">{index + 1}</td>
                  <td className="col-title">
                    {book.title || "Untitled"}
                  </td>
                  <td className="col-author">
                    <span
                      className="clickable-name"
                      onClick={() => handleAuthorClick(getAuthorId(book), getAuthorName(book))}
                    >
                      {getAuthorName(book)}
                    </span>
                  </td>
                  <td className="col-publisher">
                    <span
                      className="clickable-name"
                      onClick={() => handlePublisherClick(getPublisherId(book), getPublisherName(book))}
                    >
                      {getPublisherName(book)}
                    </span>
                  </td>
                  <td className="col-isbn">{book.isbn || "N/A"}</td>
                  <td className="col-year">{book.publishedYear || "N/A"}</td>
                  <td className="col-copies">{book.copies || 0}</td>
                  <td className="col-status">
                    <span className={`status-badge ${getStatusClass(getAvailability(book))}`}>
                      {getStatusText(getAvailability(book))}
                    </span>
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(book)}>
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(getBookId(book))}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {hoveredBook && (
        <BookHoverCard
          book={hoveredBook}
          onClose={() => setHoveredBook(null)}
        />
      )}

      {hoveredAuthor && (
        <AuthorHoverCard
          author={hoveredAuthor}
          onClose={() => setHoveredAuthor(null)}
        />
      )}

      {hoveredPublisher && (
        <PublisherHoverCard
          publisher={hoveredPublisher}
          onClose={() => setHoveredPublisher(null)}
        />
      )}

      {showAddModal && (
        <AddBookModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onBookAdded={fetchBooks}
        />
      )}

      {showEditModal && (
        <EditBookModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          book={editingBook}
          onBookUpdated={handleUpdateBook}
        />
      )}
    </div>
  )
}

export default BooksList