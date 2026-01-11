"use client"

import { useState, useEffect } from "react"
import BorrowService from "../service/BorrowService"
import BookService from "../service/BookService"
import MemberService from "../service/MemberService"
import "./BorrowManagement.css"

const BorrowManagement = () => {
  const [borrows, setBorrows] = useState([])
  const [books, setBooks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("all")
  const [showBorrowModal, setShowBorrowModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [borrowsRes, booksRes, membersRes] = await Promise.all([
        BorrowService.getAllBorrows(),
        BookService.getAllBooks(),
        MemberService.getAllMembers()
      ])
      
      setBorrows(borrowsRes.data || [])
      setBooks(booksRes.data || [])
      setMembers(membersRes.data || [])
      setError(null)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load data. Please check if the backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleReturnBook = async (borrowId) => {
    if (window.confirm("Are you sure you want to return this book?")) {
      try {
        await BorrowService.returnBook(borrowId)
        alert("Book returned successfully!")
        fetchData()
      } catch (err) {
        console.error("Error returning book:", err)
        alert("Failed to return book: " + (err.response?.data?.message || err.message))
      }
    }
  }

  const handleBorrowBook = async (borrowData) => {
    try {
      await BorrowService.createBorrow(borrowData)
      alert("Book borrowed successfully!")
      setShowBorrowModal(false)
      fetchData()
    } catch (err) {
      console.error("Error borrowing book:", err)
      alert("Failed to borrow book: " + (err.response?.data?.message || err.message))
    }
  }

  const isOverdueBorrow = (borrow) => {
    if (!borrow) return false
    if (borrow.returnDate) return false
    if (!borrow.dueDate) return false
    const due = new Date(borrow.dueDate)
    if (Number.isNaN(due.getTime())) return false
    const now = new Date()
    return due < now
  }

  const getBorrowDisplayStatus = (borrow) => {
    if (isOverdueBorrow(borrow)) return "OVERDUE"
    return borrow?.status || "UNKNOWN"
  }

  const getOverdueDays = (borrow) => {
    if (!isOverdueBorrow(borrow)) return 0
    const due = new Date(borrow.dueDate)
    const now = new Date()
    const ms = now.getTime() - due.getTime()
    const days = Math.ceil(ms / (1000 * 60 * 60 * 24))
    return Math.max(1, Number.isFinite(days) ? days : 0)
  }

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case "BORROWED":
        return "status-borrowed"
      case "RETURNED":
        return "status-returned"
      case "RETURNED_WITH_FINE":
        return "status-fine"
      case "OVERDUE":
        return "status-overdue"
      default:
        return "status-unknown"
    }
  }

  const getFilteredBorrows = () => {
    switch (activeTab) {
      case "active":
        return borrows.filter(b => !b.returnDate)
      case "overdue":
        return borrows.filter(b => isOverdueBorrow(b))
      case "returned":
        return borrows.filter(b => b.status === "RETURNED" || b.status === "RETURNED_WITH_FINE")
      default:
        return borrows
    }
  }

  const getBookTitle = (bookId) => {
    const book = books.find(b => b.id === bookId)
    return book ? book.title : "Unknown Book"
  }

  const getMemberName = (memberId) => {
    const member = members.find(m => m.id === memberId)
    return member ? `${member.firstName} ${member.lastName}` : "Unknown Member"
  }

  if (loading) return <div className="loading">Loading borrow data...</div>
  if (error) return <div className="error">{error}</div>

  const filteredBorrows = getFilteredBorrows()

  return (
    <div className="borrow-management">
      <div className="borrow-header">
        <h1>📚 Borrow/Return</h1>
        <button className="btn btn-primary" onClick={() => setShowBorrowModal(true)}>
          + Borrow Book
        </button>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Borrows ({borrows.length})
        </button>
        <button
          className={`tab ${activeTab === "active" ? "active" : ""}`}
          onClick={() => setActiveTab("active")}
        >
          Active ({borrows.filter(b => !b.returnDate).length})
        </button>
        <button
          className={`tab ${activeTab === "overdue" ? "active" : ""}`}
          onClick={() => setActiveTab("overdue")}
        >
          Overdue ({borrows.filter(b => isOverdueBorrow(b)).length})
        </button>
        <button
          className={`tab ${activeTab === "returned" ? "active" : ""}`}
          onClick={() => setActiveTab("returned")}
        >
          Returned ({borrows.filter(b => b.status === "RETURNED" || b.status === "RETURNED_WITH_FINE").length})
        </button>
      </div>

      <div className="borrows-table">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Borrow Date</th>
              <th>Due Date</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Fine</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBorrows.map((borrow) => (
              <tr key={borrow.id}>
                <td>{getBookTitle(borrow.book?.id)}</td>
                <td>{getMemberName(borrow.member?.id)}</td>
                <td>{borrow.borrowDate ? new Date(borrow.borrowDate).toLocaleDateString() : "N/A"}</td>
                <td>{borrow.dueDate ? new Date(borrow.dueDate).toLocaleDateString() : "N/A"}</td>
                <td>{borrow.returnDate ? new Date(borrow.returnDate).toLocaleDateString() : "Not returned"}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(getBorrowDisplayStatus(borrow))}`}>
                    {getBorrowDisplayStatus(borrow)}
                  </span>
                </td>
                <td>
                  {borrow.fineAmount ? (
                    `Rs ${Number(borrow.fineAmount).toFixed(2)}`
                  ) : isOverdueBorrow(borrow) ? (
                    `Rs ${(getOverdueDays(borrow) * 20).toFixed(2)} (${getOverdueDays(borrow)} days)`
                  ) : (
                    "No fine"
                  )}
                </td>
                <td>
                  {!borrow.returnDate && (
                    <button
                      className="btn btn-return"
                      onClick={() => handleReturnBook(borrow.id)}
                    >
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBorrows.length === 0 && (
          <div className="no-data">
            <i className="fas fa-book"></i>
            <h3>No borrow records found</h3>
            <p>Start by borrowing a book from the library.</p>
          </div>
        )}
      </div>

      {showBorrowModal && (
        <BorrowModal
          books={books}
          members={members}
          onClose={() => setShowBorrowModal(false)}
          onBorrow={handleBorrowBook}
        />
      )}
    </div>
  )
}

// Borrow Modal Component
const BorrowModal = ({ books, members, onClose, onBorrow }) => {
  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
    borrowDays: 14,
    borrowDate: new Date().toISOString().split("T")[0],
    dueDate: ""
  })
  const [bookQuery, setBookQuery] = useState("")
  const [showBookSuggestions, setShowBookSuggestions] = useState(false)
  const [hideSuggestionsTimeoutId, setHideSuggestionsTimeoutId] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleBookQueryChange = (e) => {
    const value = e.target.value
    setBookQuery(value)
    setShowBookSuggestions(true)
    // If the user starts typing after selecting a book, clear selection.
    if (formData.bookId) {
      setFormData(prev => ({ ...prev, bookId: "" }))
    }
  }

  const handleBookSelect = (book) => {
    if (hideSuggestionsTimeoutId) {
      clearTimeout(hideSuggestionsTimeoutId)
      setHideSuggestionsTimeoutId(null)
    }
    setFormData(prev => ({ ...prev, bookId: String(book.id) }))
    setBookQuery(formatBookLabel(book))
    setShowBookSuggestions(false)
  }

  const scheduleHideSuggestions = () => {
    const id = setTimeout(() => {
      setShowBookSuggestions(false)
      setHideSuggestionsTimeoutId(null)
    }, 150)
    setHideSuggestionsTimeoutId(id)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const computeBorrowDaysFromDates = (borrowDateStr, dueDateStr) => {
      if (!borrowDateStr || !dueDateStr) return null
      const bd = new Date(borrowDateStr)
      const dd = new Date(dueDateStr)
      if (Number.isNaN(bd.getTime()) || Number.isNaN(dd.getTime())) return null
      const days = Math.ceil((dd.getTime() - bd.getTime()) / (1000 * 60 * 60 * 24))
      if (!Number.isFinite(days)) return null
      return Math.max(1, days)
    }

    const borrowDaysFromDates = computeBorrowDaysFromDates(formData.borrowDate, formData.dueDate)
    const borrowDays = borrowDaysFromDates ?? parseInt(formData.borrowDays)

    const borrowData = {
      book: { id: parseInt(formData.bookId) },
      member: { id: parseInt(formData.memberId) },
      borrowDays,
      borrowDate: formData.borrowDate || undefined,
      dueDate: formData.dueDate || undefined
    }
    
    onBorrow(borrowData)
  }

  const normalizeStatus = (status) => (status || "").toString().trim().toUpperCase()
  const isBookAvailable = (book) => {
    const copies = Number(book?.availableCopies)
    if (!Number.isNaN(copies)) {
      return copies > 0
    }
    const s = normalizeStatus(book?.status)
    return s === "AVAILABLE" || s === "AVAIL" || s === "IN_STOCK" || s === "IN-STOCK" || s === "Available".toUpperCase()
  }

  const formatBookLabel = (book) => {
    if (!book) return ""
    const title = book.title || "(Untitled)"
    const authorName = book.author?.name
    const isbn = book.isbn

    const parts = [title]
    if (authorName) parts.push(`by ${authorName}`)
    if (isbn) parts.push(`(${isbn})`)
    return parts.join(" ")
  }

  const availableBooks = books.filter(isBookAvailable)
  const normalizedQuery = bookQuery.trim().toLowerCase()
  const bookSuggestions = normalizedQuery
    ? availableBooks
        .filter((b) => {
          const haystack = `${b.title || ""} ${b.isbn || ""} ${b.author?.name || ""}`.toLowerCase()
          return haystack.includes(normalizedQuery)
        })
        .slice(0, 10)
    : availableBooks.slice(0, 10)

  const activeMembers = members.filter(member => member.status === "ACTIVE")

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Borrow Book</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="borrow-form">
          <div className="form-group">
            <label>Select Book</label>
            <div className="autocomplete">
              <input
                type="text"
                className="autocomplete-input"
                value={bookQuery}
                onChange={handleBookQueryChange}
                onFocus={() => setShowBookSuggestions(true)}
                onBlur={scheduleHideSuggestions}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setShowBookSuggestions(false)
                  }
                }}
                placeholder="Type book name / ISBN / author..."
              />
              {showBookSuggestions && (
                <div className="autocomplete-dropdown" onMouseDown={(e) => e.preventDefault()}>
                  {bookSuggestions.length > 0 ? (
                    bookSuggestions.map((book) => (
                      <button
                        key={book.id}
                        type="button"
                        className="autocomplete-item"
                        onClick={() => handleBookSelect(book)}
                      >
                        {formatBookLabel(book)}
                      </button>
                    ))
                  ) : (
                    <div className="autocomplete-empty">No matching books</div>
                  )}
                </div>
              )}
            </div>
            <input type="hidden" name="bookId" value={formData.bookId} required />
          </div>

          <div className="form-group">
            <label>Select Member</label>
            <select name="memberId" value={formData.memberId} onChange={handleChange} required>
              <option value="">Choose a member...</option>
              {activeMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Borrow Days</label>
            <select name="borrowDays" value={formData.borrowDays} onChange={handleChange}>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={21}>21 days</option>
              <option value={30}>30 days</option>
            </select>
          </div>

          <div className="form-group">
            <label>Borrow Date</label>
            <input
              type="date"
              name="borrowDate"
              value={formData.borrowDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Due Date (optional)</label>
            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Borrow Book
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BorrowManagement
